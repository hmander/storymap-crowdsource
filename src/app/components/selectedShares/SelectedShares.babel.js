import React from 'react';
import Helper from 'babel/utils/helper/Helper';
import {getIcon} from 'babel/utils/helper/icons/IconGenerator';
import LazyImage from 'babel/components/helper/lazyImage/LazyImage';
import Autolinker from 'babel/components/helper/autolinker/Autolinker';
import viewerText from 'i18n!translations/viewer/nls/template';
import builderText from 'mode!isBuilder?i18n!translations/builder/nls/template';

export default class SelectedShares extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scrolled: false
    };

    // autobind methods
    this.onScroll = this.onScroll.bind(this);
    this.getMedia = this.getMedia.bind(this);
    this.getFieldLayout = this.getFieldLayout.bind(this);
  }

  render() {

    const mainClasses = Helper.classnames([this.props.className,this.props.classNames,'selected-share'],{
      scrolled: this.state.scrolled
    });
    const attributes = this.props.feature[this.props.attributePath];

    return (
      <div className={mainClasses}>
        <div className="selected-navigation">
          <button
            type="button"
            className="prev-btn btn text-btn"
            aria-label="Previous"
            onClick={this.props.previousAction}
            dangerouslySetInnerHTML={{__html: getIcon('arrow-left-open')}}>
          </button>
          <button
            type="button"
            className="next-btn btn text-btn"
            aria-label="Next"
            onClick={this.props.nextAction}
            dangerouslySetInnerHTML={{__html: getIcon('arrow-right-open')}}>
          </button>
          <button
            type="button"
            className="close-btn btn text-btn"
            aria-label="Close"
            onClick={this.props.closeAction}
            dangerouslySetInnerHTML={{__html: getIcon('close')}}>
          </button>
        </div>
        <div className="selected-display" onScroll={this.onScroll}>
          { this.getMedia() }
          <div className="padded-column">
            <div className="info-section">
              <h4 className="share-title">{attributes[this.props.primaryField]}</h4>
              <p><small className="share-location">{attributes[this.props.secondaryField]}</small></p>
            { this.props.displayOrder.map(this.getFieldLayout.bind(this,attributes))}
            </div>
            {this.props.reviewEnabled ? (
              <div className="review-section alert alert-info">
                <h6 className="review-header">{builderText.review.selectedShare.header}</h6>
                <div className="btn-group">
                  <button type="button" className={Helper.classnames(['btn'],{
                      'btn-default': attributes[this.props.vettedField] !== 1,
                      'btn-primary': attributes[this.props.vettedField] === 1
                    })} onClick={this.props.approveAction.bind(null,attributes[this.props.idField])}>{viewerText.selectedShares.review.options.approve}</button>
                  <button type="button" className={Helper.classnames(['btn'],{
                      'btn-default': attributes[this.props.vettedField] !== 2,
                      'btn-danger': attributes[this.props.vettedField] === 2
                    })} onClick={this.props.rejectAction.bind(null,attributes[this.props.idField])}>{viewerText.selectedShares.review.options.reject}</button>
                </div>
              </div>
            ) : null}
            </div>
        </div>
      </div>
    );
  }

  onScroll(e) {
    if (e.target.scrollTop > 0 && !this.state.scrolled) {
      this.setState({
        scrolled: true
      });
    } else if (e.target.scrollTop === 0 && this.state.scrolled) {
      this.setState({
        scrolled: false
      });
    }
  }

  getMedia() {
    const media = this.props.media;
    const attributes = this.props.feature[this.props.attributePath];
    const fieldProps = this.props.fields[media.field];

    switch (media.type) {
      case 'video':
        // add video
        break;
      default:
        let photoUrl;

        if (fieldProps.isAttachment) {
          const attachmentUrl = Helper.attachmentUtils.getAttachmentUrlsByStringMatch({
            layer: this.props.layer,
            feature: this.props.feature,
            match: media.field,
            position: 0
          })[0] || '';

          photoUrl = Helper.attachmentUtils.checkForCredential({
            url: attachmentUrl,
            layer: this.props.layer
          });
        } else {
          photoUrl = Helper.attachmentUtils.checkForCredential({
            url: this.props.thumbnailUrlPrepend + attributes[media.field] + this.props.thumbnailUrlAppend,
            layer: this.props.layer
          });
        }

        return (
          <div className="media-section">
            <LazyImage className="media-photo"
              autoSizeDiv={true}
              src={photoUrl}>
            </LazyImage>
          </div>
        );
    }
  }

  getFieldLayout(attributes,current) {

      if (typeof current === 'string') {
        const fieldClasses = Helper.classnames(['field-display', 'field-' + current]);
        const fieldProps = this.props.fields[current];

        if (fieldProps && fieldProps.type === 'textarea') {
          return (<Autolinker key={current} className={fieldClasses} text={attributes[current]}></Autolinker>);
        } else {
          return (<p key={current} className={fieldClasses}>{attributes[current]}</p>);
        }
      }
  }

}

SelectedShares.propTypes = {
  reviewEnabled: React.PropTypes.bool,
  approveAction: React.PropTypes.func,
  rejectAction: React.PropTypes.func,
  closeAction: React.PropTypes.func,
  previousAction: React.PropTypes.func,
  nextAction: React.PropTypes.func,
  feature: React.PropTypes.shape({
    attributes: React.PropTypes.shape({})
  }),
  displayOrder: React.PropTypes.array,
  attributePath: React.PropTypes.string.isRequired,
  idField: React.PropTypes.string.isRequired,
  primaryField: React.PropTypes.string.isRequired,
  secondaryField: React.PropTypes.string.isRequired,
  vettedField: React.PropTypes.string,
  media: React.PropTypes.shape({
    type: React.PropTypes.string,
    field: React.PropTypes.string
  }),
  thumbnailUrlPrepend: React.PropTypes.string,
  thumbnailUrlAppend: React.PropTypes.string,
  layer: React.PropTypes.oneOfType([
    React.PropTypes.shape({
      url: React.PropTypes.string,
      credential: React.PropTypes.shape({
        server: React.PropTypes.string,
        token: React.PropTypes.string
      })
    }),
    React.PropTypes.bool
  ])
};

SelectedShares.defaultProps = {
  feature: {
    attributes: {}
  },
  displayOrder: [],
  thumbnailUrlPrepend: '',
  thumbnailUrlAppend: '',
  reviewEnabled: false,
  approveAction: () => {},
  rejectAction: () => {},
  closeAction: () => {},
  previousAction: () => {},
  nextAction: () => {}
};
