import React, { Fragment, Component, PureComponent } from 'react';

import some from 'lodash/some';
import flatten from 'lodash/flatten';

import { connectProject } from '../../helpers';

import Wizard from '../../components/wizard';
import Fieldset from '../../components/fieldset';
import Controls from '../../components/controls';
import Complete from '../../components/complete';
import NTS from '../../components/nts';
import Playback from '../../components/playback';
import Link from '../../components/link';

import ReviewSection from './review';

class Questions extends PureComponent {
  state = {
    ntsAccepted: !this.props.nts || some((this.props.fields || this.props.steps[this.props.step].fields), field => this.props.values[field.name])
  }

  ref = React.createRef()

  toggleAccepted = () => {
    this.setState({ ntsAccepted: !this.state.ntsAccepted }, this.scrollToElement);
  }

  scrollToElement = () => {
    window.scrollTo({
      top: this.ref.current.offsetTop,
      behavior: 'smooth'
    });
  }

  getFields = () => {
    const fields = this.props.fields;
    return fields.filter(field => {
      if (field.show && typeof field.show === 'function') {
        return field.show(this.props.project)
      }
      return true;
    });
  }

  render = () => {
    const { title, values, save, advance, exit, nts, subtitle, intro, linkTo, playback } = this.props;
    const { ntsAccepted } = this.state;
    return (
      <Fragment>
        <h1>{ title }</h1>
        {
          nts && <NTS onAccept={this.toggleAccepted} accepted={ntsAccepted} />
        }
        {
          (!nts || ntsAccepted) && (
            <div ref={this.ref}>
              {
                linkTo && <p><Link to={linkTo} /></p>
              }
              {
                playback && <Playback playback={playback} />
              }
              {
                subtitle && <h2>{ subtitle }</h2>
              }
              {
                intro && <p className="grey">{ intro }</p>
              }
              <Fieldset
                fields={this.getFields()}
                values={values}
                onFieldChange={save}
              />
              <Controls onContinue={advance} onExit={exit} />
            </div>
          )
        }
      </Fragment>
    )
  }
}

class Review extends Component {
  onCompleteChange = complete => {
    this.props.save(`${this.props.section}-complete`, complete);
    this.props.exit();
  }

  render = () => {
    const { retreat, steps, fields, ...props } = this.props;
    const ReviewComponent = props.review || ReviewSection;
    const reviewFields = steps ? flatten(steps.filter(s => !s.repeat).map(s => s.fields)) : fields
    return (
      <Fragment>
        <ReviewComponent
          { ...this.props }
          onEdit={retreat}
          fields={reviewFields}
        />
        <Complete
          className="panel"
          onChange={this.onCompleteChange}
          complete={this.props.values[`${this.props.section}-complete`]}
          label="This section is complete"
        >
          <h2>Mark this section as complete?</h2>
          <p>You can still edit this section later, but you will be unable to send this application to the Home Office until all sections are marked as complete.</p>
        </Complete>
      </Fragment>
    )
  }
}

class Section extends PureComponent {
  showStep = step => {
    if (!step.show) {
      return true;
    }
    return step.show(this.props.project);
  }

  render = () => {
    const { onProgress, exit, step, ...props } = this.props;
    if (!props.project) {
      return null
    }
    const steps = props.steps || [props];

    return (
      <Wizard onProgress={ step => onProgress(step) } step={ step }>
        {
          steps.filter(this.showStep).map((stepSettings, index) => {
            const Component = stepSettings.component || Questions;
            return <Component values={props.project} key={index} exit={exit} step={index} {...props} {...stepSettings} />
          })
        }

        <Review {...props} values={props.project} step={steps.length} onContinue={exit} exit={exit} />
      </Wizard>
    )
  }
}

export default connectProject(Section)
