import {Value} from 'slate';
import React from 'react';
import {uniq, flatMap} from 'lodash';

export const hydrateSteps = (protocols, steps, reusableSteps) => {

  const reusableStepsInAllProtocols =
    flatMap((protocols || [])
      .filter(protocol => !protocol.deleted), (protocol, index) => (protocol.steps || [])
      .filter(step => !!step.reusableStepId)
      .map(step => {
        return { reusableStepId: step.reusableStepId, protocolIndex: index + 1, protocolId: protocol.id };
      })
    )
      .reduce((map, reusableStep) => {
        if (!map[reusableStep.reusableStepId]) {
          map[reusableStep.reusableStepId] = [];
        }
        map[reusableStep.reusableStepId].push({ protocolNumber: reusableStep.protocolIndex, protocolId: reusableStep.protocolId });
        return map;
      }, {});

  const hydratedSteps = (steps || []).filter(Boolean)
    .map(step => {
      if (step.reusableStepId) {
        const reusableStep = {
          ...reusableSteps[step.reusableStepId],
          usedInProtocols: uniq(reusableStepsInAllProtocols[step.reusableStepId]),
          reusedStep: true
        };
        return { ...reusableStep, ...step };
      }
      return step;
    });

  return [hydratedSteps, Object.values(reusableSteps)];
};

export const removeNewDeleted = (steps, previousSteps) => {
  let oldSteps = [];
  previousSteps.forEach(protocol => {
    protocol.forEach(step => oldSteps.push(step.id));
  });
  return (steps || []).filter(p => {
    if (p.deleted === true) {
      return !!oldSteps.includes(p.id);
    }
    return true;
  });
};

export const addDeletedReusableSteps = (steps, previousSteps, reusableSteps) => {
  let stepIds = [];
  steps.forEach(step => {
    stepIds.push(step.id);
  });
  let oldIndex = 0;
  for (let i = 0; i < previousSteps.length; i++) {
    if (stepIds.includes(previousSteps[i].id)) {
      oldIndex = stepIds.indexOf(previousSteps[i].id);
    } else {
      oldIndex = oldIndex + 1;
      const found = reusableSteps.find((reusableStep) => reusableStep.id === previousSteps[i].reusableStepId);
      let step = {...found};
      step.deleted = true;
      steps.splice(oldIndex, 0, step);
    }
  }
  return steps;
};

export const getTruncatedStepTitle = (step, numCharacters) => {
  const title = getStepTitle(step.title, null);
  if (!title || title.trim() === '') return null;
  return title.substring(0, Math.min(title.length, numCharacters));
};

export const getStepTitle = (title, untitled = <em>Untitled step</em>) => {
  if (!title) {
    return untitled;
  }

  if (typeof title === 'string') {
    try {
      title = JSON.parse(title);
    } catch (e) {
      return untitled;
    }
  }

  const value = Value.fromJSON(title);
  return value.document.text && value.document.text !== ''
    ? value.document.text
    : untitled;
};

export const reusableStepFieldKeys = (protocol) => {
  if (!Array.isArray(protocol.steps)) {
    return [];
  }
  return (protocol.steps || [])
    .filter(step => step.reusableStepId)
    .map(reusableStep => `reusableSteps.${reusableStep.reusableStepId}`);
};

export const getRepeatedFromProtocolIndex = (step, currentProtocolId) => {
  return (step.usedInProtocols || []).length > 0 && step.usedInProtocols[0].protocolId !== currentProtocolId ? step.usedInProtocols[0].protocolNumber : undefined;
};
