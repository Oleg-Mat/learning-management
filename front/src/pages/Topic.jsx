import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTopicsData } from '../redux/Lections/actions';
import { Button, Header, Modal, Form } from 'semantic-ui-react';

class Topic extends Component {
  state = {
    topic: {},
    videostr: '',
    str: '',
    topicPhase: '',
    topicWeek: '',
    topicDay: '',
    youtubeLink: '',
    githubLink: '',
    fileLink: '',
    topicName: '',
    modalOpen: false,
    buttonClicked: '',
    closedStatus:false,
    changeData:true,
  };
  async componentDidMount() {
    await this.props.getTopics(this.props.selectedGroup);

    const topic = this.props.allTopics.find(el => el._id === this.props.match.params.id);
    await this.setState({
      topicName: topic.topicName,
      topicPhase: topic.phase,
      topicWeek: topic.week,
      topicDay: topic.day,
    });
    const videoSrc = topic.video;
    let videostr = '';
    if (videoSrc.includes('watch')) {
      videostr = videoSrc.replace('watch?v=', 'embed/');
    } else {
      videostr = videoSrc.replace('youtu.be/', 'youtube.com/embed/');
    }
    this.setState({ topic: topic, videostr: videostr });
  }
  youtubeLink = e => {
    this.setState({ youtubeLink: e.target.value });
  };
  topicName = e => {
    this.setState({ topicName: e.target.value });
  };
  githubLink = e => {
    this.setState({ githubLink: e.target.value });
  };
  fileLink = e => {
    this.setState({ fileLink: e.target.value });
  };

  handleOpen = e => {
    this.setState({ modalOpen: true });
  };
  handleClose = e => {
    this.setState({ modalOpen: false });
    // this.setState({closedStatus:true})
  };

  func = async () => {
    let data = {
      youtubeLink: this.state.youtubeLink,
      githubLink: this.state.githubLink,
      fileLink: this.state.topicName,
      id: this.props.match.params.id,
    };
    let resp = await fetch('/edittopic', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let dataresp = await resp.json();
    this.setState({ modalOpen: false ,changeData:false});
    this.setState({ changeData:false});
    // this.setState({buttonClicked:'sdasd'});
  };
  get = async e => {
    e.preventDefault();
    this.setState({changeData:true})
    this.func();
  };


  async componentDidUpdate(prevProps, prevState) {
    // if (prevState.modalOpen && !this.state.modalOpen) {
      if (prevState.changeData && !this.state.changeData) {
     console.log("STATE CHANGED");
     
        await this.func();
      await this.props.getTopics(this.props.selectedGroup);
      const topic = this.props.allTopics.find(el => el._id === this.props.match.params.id);
      this.setState({
        topicName: topic.topicName,
        topicPhase: topic.phase,
        topicWeek: topic.week,
        topicDay: topic.day,
      });
      const videoSrc = topic.video;
      let videostr = '';
      if (videoSrc.includes('watch')) {
        videostr = videoSrc.replace('watch?v=', 'embed/');
      } else {
        videostr = videoSrc.replace('youtu.be/', 'youtube.com/embed/');
      }
      this.setState({ topic: topic, videostr: videostr });
      // this.setState({changeData:true})
    }
  }

  render() {
    // const { closeOnDocumentClick,closeIcon } = this.state
    return (
      <>
        {this.props.admin ? (
          <>
            <Modal
              trigger={
                <Button positive onClick={this.handleOpen}>
                  edit
                </Button>
              }
              closeIcon
              open={this.state.modalOpen}
              // close={this.state.modalOpen}
              onClose={this.handleClose}
              // basic
            >
              <Modal.Header>{this.state.topicName}</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  <Header className="regForm">
                    Фаза:{this.state.topicPhase} Неделя:{this.state.topicWeek} День:{this.state.topicDay}
                  </Header>
                  {/* ФОрма */}
                  <Modal.Actions>
                    <Form className="regForm">
                      <Form.Field>
                        <label htmlFor="topicname">TopicName</label>
                        <input type="text" name="topicname" required onChange={this.topicName} />
                      </Form.Field>
                      <Form.Field>
                        <label htmlFor="youtubelink">YoutubeLink</label>
                        <input type="text" name="youtubelink" onChange={this.youtubeLink} />
                      </Form.Field>
                      <Form.Field>
                        <label htmlFor="githubLink">githubLink</label>
                        <input type="text" name="githubLink" onChange={this.githubLink} />
                      </Form.Field>
                      <Form.Field>
                        <label htmlFor="fileLink">fileLink</label>
                        <input type="text" name="fileLink" onChange={this.fileLink} />
                      </Form.Field>
                      <Form.Field>
                        <label htmlFor="fileupload">FileUpload</label>
                        <input type="text" name="fileupload" />
                      </Form.Field>
                      <div className="form-field">
                        <Button type="button" className="Button" onClick={this.get}>
                          Отправить
                        </Button>{' '}
                      </div>
                    </Form>
                  </Modal.Actions>
                  {/* форма */}
                </Modal.Description>
              </Modal.Content>
            </Modal>
          </>
        ) : (
          <></>
        )}

        <div className="videoContainer">
          <h1 className="topicHeader">Тема урока: {this.state.topic.topicName}</h1>

          <div className="video">
            <iframe
              src={this.state.videostr}
              width="960"
              height="540"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="video"
            />
          </div>
          <div className="videoLinksFilesSegment">
            <div className="videoLinksFiles">
              <div className="videoLinks">
                <a target="_blank" rel="noopener noreferrer" href={this.state.topic.githubLink}>
                  Задания на GitHub
                </a>
                <a target="_blank" rel="noopener noreferrer" href={this.state.FileLink}>
                  Код урока
                </a>
              </div>
              <div className="videoFile">
                <p className="fileTitle">Файл к уроку</p>
                <Link
                  // to={FilePath.filePath}
                  to="./images/IMG_7778.jpg"
                  download
                  target="_blank"
                >
                  <Button
                    basic
                    type="button"
                    color="violet"
                    className="btn btn-success btn-block"
                    content={this.state.File}
                    onClick={this.but}
                    icon="download"
                    fluid
                  ></Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    allTopics: state.Topics.allTopics,
    selectedGroup: state.Topics.selectedGroupName,
    admin: state.User.user.adminstatus,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // getNews: () => dispatch(getNewsData())
    getTopics: selectedGroup => dispatch(getTopicsData(selectedGroup)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Topic);
