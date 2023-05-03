import React from 'react';
import { Markdown } from '@ukhomeoffice/asl-components';

import Repeater from '../../../components/repeater-field';
import Controls from '../../../components/controls';

const getItems = (values, repeats) => {
  const items = values[repeats];
  if (items && items.length) {
    return items;
  }
};

const Items = ({
  title,
  save,
  subtitle,
  intro,
  advance,
  repeats,
  exit,
  ...props
}) => {
  return (
    <div className={`repeats-${repeats}`}>
      <h1>{ title }</h1>
      {
        subtitle && <h2>{subtitle}</h2>
      }
      {
        intro && <Markdown className="grey" links={true}>{intro}</Markdown>
      }
      <Repeater
        items={getItems(props.values, repeats)}
        type={repeats}
        singular={props.singular}
        onSave={items => save({ [repeats]: items })}
        {...props}
      />
      <Controls onContinue={advance} onExit={exit} />
    </div>
  );
};

export default Items;
