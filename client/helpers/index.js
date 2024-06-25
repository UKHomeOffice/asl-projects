import flatten from 'lodash/flatten';
import values from 'lodash/values';
import castArray from 'lodash/castArray';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import {format as dateFormatter} from 'date-fns';
import {JSONPath} from 'jsonpath-plus';
import LEGACY_SPECIES from '../constants/legacy-species';
import {projectSpecies as SPECIES} from '@ukhomeoffice/asl-constants';
import CONDITIONS from '../constants/conditions';

export const formatDate = (date, format) => (date ? dateFormatter(date, format) : '-');

export const getConditions = (values, project) => {
  const isProtocol = !!project;

  // remove any old-style conditions from before the days of types
  const previous = (values.conditions || []).filter(Boolean).filter(c => c.type);

  const editedConditions = previous.filter(c => c.autoAdded && c.edited);

  let conditions = isProtocol
    ? CONDITIONS.protocol
    : CONDITIONS.project;

  conditions = map(conditions, (condition, key) => ({ ...condition, key }));

  const newConditions = conditions.map(condition => {
    const editedCondition = editedConditions.find(c => c.key === condition.key);
    const path = `${condition.key}.versions.${condition.versions.length - 1}`;

    if (editedCondition) {
      return { ...editedCondition };
    } else if (condition.include && condition.include(values, project)) {
      return {
        path,
        key: condition.key,
        type: condition.type,
        autoAdded: true
      };
    }
  }).filter(Boolean);

  return [
    // fully custom conditions
    ...previous.filter(c => !c.autoAdded),
    // edited conditions
    ...newConditions
  ];
};

export function mapPermissiblePurpose(project) {
  const values = project['permissible-purpose'] || [];
  const others = project['translational-research'] || [];
  return [
    ...values,
    ...others
  ];
}

export function mapAnimalQuantities(project, name) {
  const species = []
    .concat(project.species)
    .reduce((arr, s) => {
      if (s.match(/^other-/)) {
        const others = castArray(project[`species-${s}`]);
        return [ ...arr, ...others ];
      }
      return [ ...arr, s ];
    }, [])
    .filter(Boolean);

  return species
    .reduce((obj, key) => {
      return {
        ...obj,
        [`${name}-${key}`]: project[`${name}-${key}`]
      };
    }, { species });
}

export function mapSpecies(project) {
  const species = project.species || [];
  const other = project['species-other'] || [];
  return flatten([
    ...species.map(val => {
      if (val.indexOf('other') > -1) {
        return project[`species-${val}`] || [];
      }
      const item = flatten(values(SPECIES)).find(s => s.value === val);
      return item ? item.label : val;
    }),
    ...other
  ]);
}

export const getScrollPos = (elem, offset = 0) => {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop) + offset;
};

function mapReusableStepsToReferringSteps(project) {
  return project.protocols.flatMap(
    (protocol) =>
      protocol.steps
        .filter(step => step.reusableStepId)
        .map(
          step => ({
            source: `reusableSteps.${step.reusableStepId}`,
            target: `protocols.${protocol.id}.steps.${step.id}`
          })
        )
  ).reduce((acc, {source, target}) => ({
    ...acc,
    [source]: [...(acc[source] ?? []), target]
  }), {});
}

function aliasReusableStepCommentsToReferringSteps(newComments, reusableStepMapping) {
  const reusableStepKeys = [...Object.keys(reusableStepMapping)];

  return Object.entries(newComments)
    .flatMap(
      ([field, comments]) => {
        let matchedKey = reusableStepKeys.find(key => field.startsWith(key));
        return matchedKey
          ? reusableStepMapping[matchedKey].map(target => [field.replace(matchedKey, target), comments])
          : [[field, comments]];
      }
    )
    .reduce(
      (acc, [field, comments]) => ({
        ...acc,
        [field]: [...(acc[field] ?? []), ...comments]
      }),
      {}
    );
}

/**
 * Filter comments to only those flagged as new that are from other users.
 * @param comments
 * @param user
 * @param project Optional - if provided any reusable step comments will be aliassed to the steps that reference them
 * @return A record of field paths mapped to comments that apply to that field
 */
export const getNewComments = (comments, user, project) => {
  const filterNew = field => field.filter(comment => comment.isNew && comment.author !== user && !comment.deleted);
  const newComments = pickBy(mapValues(comments, filterNew), filterNew);

  if (project?.reusableSteps) {
    const reusableStepMapping = mapReusableStepsToReferringSteps(project);
    return aliasReusableStepCommentsToReferringSteps(newComments, reusableStepMapping);
  } else {
    return newComments;
  }
};

export const getLegacySpeciesLabel = species => {
  const matched = LEGACY_SPECIES.find(s => s.value === species.speciesId);
  let label = matched && matched.label;
  if (species.speciesId === '28') {
    label = species['other-species-type'];
  }
  return label;
};

export const flattenReveals = (fields, values) => {
  return fields.reduce((arr, item) => {
    const reveals = [];
    if (item.options && !item.preserveHierarchy) {
      item.options.forEach(option => {
        if (option.reveal) {
          // fixes ASL-4119 where the user has already clicked the hidden checkbox
          if (option.value === 'translational-research') {
            return null;
          }
          if (Array.isArray(values[item.name]) && values[item.name].includes(option.value)) {
            reveals.push(flattenReveals(castArray(option.reveal), values));
          } else if (option.value === values[item.name]) {
            reveals.push(flattenReveals(castArray(option.reveal), values));
          }
        }
      });
    }
    return flatten([
      ...arr,
      item,
      flatten(reveals)
    ]);
  }, []);
};

export function getFields(section, includeReveals = false) {
  if (section.name === 'protocols') {
    return flatten(flatten(Object.values(section.sections).concat(section.fields).map(getFields))
      .map(field => {
        if (includeReveals) {
          return getRevealFields(field);
        } else {
          return { ...field, name: `protocols.*.${field.name}` };
        }
      }));
  }
  if (section.fields && section.fields.length) {
    return section.fields.map(field => {
      if (field.repeats) {
        return {
          ...field,
          name: `${section.repeats}.*.${field.name}`
        };
      }
      return field;
    });
  } else if (section.steps) {
    return flatten(section.steps.map(getFields));
  } else return [];
}

export function getRevealFields(field) {
  const result = [...new Set(JSONPath({path: '$..reveal..name', json: field}))];
  if (result && result.length > 0) {
    return result.reduce(
      (pv, cv) => [...pv, { name: `protocols.*.${cv}` }],
      [{ name: `protocols.*.${field.name}` }]
    );
  } else {
    return { name: `protocols.*.${field.name}` };
  }
}

/* eslint-disable no-control-regex */
export const stripInvalidXmlChars = text => {
  if (typeof text !== 'string') {
    return text;
  }
  return text.replace(/([^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFC\u{10000}-\u{10FFFF}])/ug, '');
};

export const isTrainingLicence = values => {
  return values['training-licence'] || (values['permissible-purpose'] || []).includes('higher-education');
};

export const getCurrentURLForFateOfAnimals = () => {
  let currentURL = window.location.href;
  // Remove everything after '/edit/' including 'protocols' and everything after it
  currentURL = currentURL.split('/edit/')[0] + '/edit/fate-of-animals';
  return currentURL;
};
