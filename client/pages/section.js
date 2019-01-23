import React from 'react';
import { connect } from 'react-redux';
import { updateProject } from '../actions/projects';
import DefaultSection from './sections';

const mapStateToProps = (state, props) => {
  const section = Object.values(state.application).reduce((found, section) => {
    return found || section.subsections[props.match.params.section];
  }, null);

  section.fields = section.fields || [];

  return {
    id: props.match.params.id,
    step: parseInt(props.match.params.step, 10) || 0,
    section: props.match.params.section,
    ...section
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const id = parseInt(props.match.params.id, 10);
  return {
    update: (data, value) => {
      if (typeof data === 'string') {
        return dispatch(updateProject(id, { [data]: value }));
      }
      return dispatch(updateProject(id, data));
    }
  };
};

class Section extends React.Component {

  render() {
    const Component = this.props.component || DefaultSection;
    const { fields, title, step, section, ...rest } = this.props;

    return <Component
      { ...this.props }
      title={ title }
      section={ section }
      save={ (...args) => this.props.update(...args) }
      exit={ () => this.props.history.push(`/project/${this.props.id}`) }
      fields={ fields }
      step={ step }
      { ...rest }
      onProgress={ step => this.props.history.push(`/project/${this.props.id}/${this.props.section}/${step}`) }
      />
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Section);
