import {Value} from 'slate';
import React from 'react';
import { uniq } from 'lodash';

export const hydrateSteps = (protocols, steps, reusableSteps) => {

  const reusableStepsInAllProtocols =
    (protocols || [])
      .filter(protocol => !protocol.deleted)
      .flatMap((protocol, index) => (protocol.steps || [])
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
