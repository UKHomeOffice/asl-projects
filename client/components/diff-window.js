import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Value } from 'slate';
import get from 'lodash/get';
import { Warning } from '@ukhomeoffice/react-components';
import { fetchQuestionVersions } from '../actions/projects';
import { mapAnimalQuantities } from '../helpers';
import Modal from './modal';
import ReviewField from './review-field';
import Tabs from './tabs';
import { findArrayDifferences } from '../helpers/array-diff';
import normaliseWhitespace from '../helpers/normalise-whitespace';

const DEFAULT_LABEL = 'No answer provided';

const DiffWindow = (props) => {

  const [modalOpen, setModelOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const project = useSelector(state => state.project);
  const isRa = useSelector(state => state.application.schemaVersion) === 'RA';

  const versions = useSelector(state => {

    const iterations = isRa
      ? get(state, 'application.project.retrospectiveAssessments')
      : get(state, 'application.project.versions');

    const isFirstIteration = iterations.length <= 2 || iterations[1].status === 'granted';
    const arr = [];
    if (props.changedFromGranted) {
      arr.push('granted');
    } else if (props.changedFromFirst && !isFirstIteration) {
      arr.push('first');
    }
    // if the latest version and the granted version are the same then don't add separate tabs
    if (props.changedFromLatest && iterations[1] && iterations[1].status !== 'granted') {
      arr.push('latest');
    }
    return arr;
  });

  const dispatch = useDispatch();

  const before = useSelector(state => get(state.questionVersions, `['${props.name}'].${versions[active]}.value`));

  const changes = useSelector(state => {
    if (props.type === 'keywords' && props.value.length > 0 && before) {
      return findArrayDifferences(before, props.value);
    }
    return get(state.questionVersions, `['${props.name}'].${versions[active]}.diff`, { added: [], removed: [] });
  });

  useEffect(() => {
    if (!before && modalOpen) {
      setLoading(true);
      dispatch(fetchQuestionVersions(props.name, { version: versions[active], type: props.type, isRa }))
        .then(() => setLoading(false));
    }
  }, [props.name, versions[active], modalOpen]);

  const toggleModal = e => {
    e.preventDefault();
    setModelOpen(!modalOpen);
  };

  const selectTab = n => e => {
    e.preventDefault();
    setActive(n);
  };

  const parseValue = (val) => {
    if (typeof val === 'string') {
      val = JSON.parse(val || '{}');
    }
    return Value.fromJSON(val || {});
  };

  const hasContentChanges = (a, b, type) => {
    if (type !== 'texteditor') {
      return true;
    }

    const before = parseValue(a);
    const after = parseValue(b);

    return normaliseWhitespace(before.document.text) !== normaliseWhitespace(after.document.text);
  };

  const decorateNode = (parts) => {

    return (node) => {
      const decorations = [];
      if (!node.type) {
        let start = 0;

        const getDiffs = text => {
          const length = text.text.length;
          return parts.filter(d => {
            const end = d.start + d.count;
            const startsInside = d.start >= start && d.start < start + length;
            const endsInside = end > start && end <= start + length;
            const wrapsAround = d.start < start && end > start + length;
            return startsInside || endsInside || wrapsAround;
          });
        };

        for (const txt of node.texts()) {
          const [text, path] = txt;
          const localDiffs = getDiffs(text);

          localDiffs.forEach(d => {
            decorations.push({
              type: d.removed ? 'removed' : 'added',
              data: {
                value: d.value
              },
              anchor: {
                path,
                key: text.key,
                offset: d.start - start
              },
              focus: {
                path,
                key: text.key,
                offset: d.start - start + d.count
              }
            });
          });

          start += text.text.length;
        }

      }

      return decorations;

    };

  };

  const renderDecoration = (props) => {
    const { children, decoration, attributes } = props;
    return <span className={classnames('diff', decoration.type)} {...attributes}>{ children }</span>;
  };

  const renderDiff = (parts, value) => {

    const getLabel = item => {
      if (!props.options || !Array.isArray(props.options)) {
        return item;
      }

      const option = props.options.find(opt => opt.value === item);
      return option ? option.label : item;
    };

    const arrayDiff = () => {
      return parts
        .reduce((arr, { value, added, removed }) => {
          return [ ...arr, ...value.map(v => ({ value: v, added, removed })) ];
        }, [])
        .map(item => ({ ...item, label: getLabel(item.value) }))
        .map(({ value, added, removed, label }) => {
          return <li key={value}><span className={classnames({ added, removed, diff: (added || removed) })}>{ label }</span></li>;
        });
    };

    const radioDiff = () => {
      return (
        <p>
          {
            value === undefined ? (
              <em>{ DEFAULT_LABEL }</em>
            ) : (
              <span className={`diff ${parts.added ? 'added' : 'removed'}`}> { value ? 'Yes' : 'No'}</span>
            )
          }
        </p>
      );
    };

    const permissiblePurposeDiff = () => {
      const diffs = parts
        .reduce((arr, { value, added, removed }) => {
          return [ ...arr, ...value.map(v => ({ value: v, added, removed })) ];
        }, []);

      const Option = ({ option }) => {
        const diff = diffs.find(d => d.value === option.value);
        if (diff) {
          const { added, removed, value } = diff;
          const { label } = option;
          return <li key={value}><span className={classnames({ added, removed, diff: (added || removed) })}>{ label }</span></li>;
        }
        return null;
      };

      return props.options
        .map(option => {
          if (option.value === 'translational-research') {
            return <ul key={option.value}>
              {
                option.reveal.options.map(o => <Option option={o} key={o.value} />)
              }
            </ul>;
          }
          return <Option option={option} key={option.value} />;
        });
    };

    switch (props.type) {
      case 'text':
        return (
          <p>
            {
              parts.length
                ? parts.map(({ value, added, removed }) => (
                  <span key={value} className={classnames({ added, removed, diff: (added || removed) })}>{ value }</span>
                ))
                : value || <em>{ DEFAULT_LABEL }</em>
            }
          </p>
        );

      case 'checkbox':
      case 'location-selector':
      case 'objective-selector':
      case 'species-selector':
        return parts.length
          ? (
            <ul>
              { arrayDiff() }
            </ul>
          )
          : (
            <p>
              <em>{ DEFAULT_LABEL }</em>
            </p>
          );
      case 'keywords':
        if (parts.length) {
          return (
            <ul>
              { arrayDiff() }
            </ul>
          );
        } else if ((value || []).length >= 1) {
          return (
            <ul>
              {
                value.map((keyword, i) => (
                  <li key={i}>{keyword}</li>
                ))
              }
            </ul>
          );
        } else {
          return (
            <p>
              <em>{ DEFAULT_LABEL }</em>
            </p>
          );
        }
      case 'radio':
        return radioDiff();
      case 'permissible-purpose':
        return parts.length
          ? (
            <ul>
              { permissiblePurposeDiff() }
            </ul>
          )
          : (
            <p>
              <em>{ DEFAULT_LABEL }</em>
            </p>
          );
      case 'animal-quantities':
        if (value === undefined) {
          value = mapAnimalQuantities(project, props.name);
        }
        return (
          <ReviewField
            key={value + active + JSON.stringify(parts)}
            {...props}
            name={props.name}
            decorateNode={decorateNode(parts)}
            renderDecoration={renderDecoration}
            type={props.type}
            value={value}
            project={value}
            diff={true}
            noComments
          />
        );
      default:
        return (
          <ReviewField
            key={value + active + JSON.stringify(parts)}
            {...props}
            name={props.name}
            decorateNode={decorateNode(parts)}
            renderDecoration={renderDecoration}
            options={props.options}
            type={props.type}
            value={value}
            values={{[props.name]: value}}
            diff={true}
            noComments
          />
        );

    }
  };

  const controls = () => {
    const labels = {
      granted: 'Current licence',
      first: 'Initial submission',
      latest: 'Previous version'
    };

    return (versions.length === 2)
      ? (
        <Fragment>
          <Tabs active={active}>
            <a href="#" onClick={selectTab(0)}>{ labels[versions[0]] }</a>
            <a href="#" onClick={selectTab(1)}>{ labels[versions[1]] }</a>
          </Tabs>
        </Fragment>
      )
      : (
        <Fragment>
          <h3>{labels[versions[0]]}</h3>
        </Fragment>
      );
  };

  const compare = () => {

    const hasVisibleChanges = hasContentChanges(before, props.value, props.type);
    let { removed, added } = changes;
    if (props.type === 'radio') {
      removed = { added: false };
      added = { added: true };
    }

    return <Fragment>
      {
        !hasVisibleChanges && <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <Warning>
              <p>There are no changes to the text in this answer. The changes might include formatting or images.</p>
            </Warning>
          </div>
        </div>
      }
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          {
            controls()
          }
          <div className="panel light-grey before">
            {
              loading ? <p>Loading...</p> : renderDiff(removed, before)
            }
          </div>
        </div>
        <div className="govuk-grid-column-one-half">
          <h3>Proposed</h3>
          <div className="panel light-grey after">
            {
              renderDiff(added, props.value)
            }
          </div>
        </div>
      </div>
    </Fragment>;
  };

  return modalOpen
    ? (
      <Modal onClose={toggleModal}>
        <div className="diff-window">
          <div className="diff-window-header">
            <h1>See what&apos;s changed</h1>
            <a href="#" className="float-right close" onClick={toggleModal}>Close</a>
          </div>
          <div className="diff-window-body">
            <h2>{props.label}</h2>
            { compare() }
          </div>
          <div className="diff-window-footer">
            <h3><a href="#" className="float-right close" onClick={toggleModal}>Close</a></h3>
          </div>
        </div>
      </Modal>
    )
    : <a href="#" className="modal-trigger" onClick={toggleModal}>See what&apos;s changed</a>;
};

export default DiffWindow;
