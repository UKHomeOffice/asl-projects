import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import minimatch from 'minimatch';

const selector = ({
  changes: {
    first = [],
    latest = [],
    granted = []
  } = {},
  application: {
    previousProtocols
  } = {}
}) => ({
  first,
  latest,
  granted,
  previousProtocols
});

export default function ChangedBadge({ fields = [], changedFromGranted, changedFromLatest, changedFromFirst, protocolId, noLabel }) {
  const { latest, granted, first, previousProtocols } = useSelector(selector, shallowEqual);
  if (!latest.length && !granted.length && !first.length) {
    return null;
  }
  const changedFrom = source => {
    return source.length && fields.some(field => {
      return source.some(change => {
        return minimatch(change, field);
      });
    });
  };

  if ((changedFromLatest || changedFrom(latest)) && (!protocolId || previousProtocols.previous.includes(protocolId))) {
    return <span className="badge changed">{ noLabel ? '' : 'changed' }</span>;
  }
  if ((changedFromGranted || changedFrom(granted)) && (!protocolId || previousProtocols.granted.includes(protocolId))) {
    return <span className="badge">{noLabel ? '' : 'amended'}</span>;
  }
  if ((changedFromFirst || changedFrom(first)) && (!protocolId || previousProtocols.first.includes(protocolId))) {
    return <span className="badge">{noLabel ? '' : 'changed'}</span>;
  }

  return null;
}
