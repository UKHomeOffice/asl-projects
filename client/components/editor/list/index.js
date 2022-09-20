import EditList from '@joefitter/slate-edit-list';
import renderBlock from './renderers';

export default function List() {
  const core = EditList({
    types: ['bulleted-list', 'numbered-list'],
    typeItem: 'list-item'
  });
  return {
    ...core,
    renderBlock,
    // shouldNodeComponentUpdate: props => {
    //   // To update the highlighting of nodes inside the selection
    //   return props.node.type === 'list-item';
    // }
  };
}
