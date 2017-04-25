import React from 'react';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { elapsed: 0, playQueuePosition: 0 };
    this.duration = 0;
    this.togglePlay = this.togglePlay.bind(this);
    this.updateTimeline = this.updateTimeline.bind(this);
    this.movePlayhead = this.movePlayhead.bind(this);
    this.scrollPlayback = this.scrollPlayback.bind(this);
    this.nextSong = this.nextSong.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.playQueue !== newProps.playQueue) {
      this.props.receiveCurrentSong(newProps.playQueue[0]);
      this.setState({ playQueuePosition: 0 });
      this.togglePlay();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.playQueue.length >= 1 && !this.props.playing && this.state.elapsed === 0) {
      this.props.receiveCurrentSong(this.props.playQueue[this.state.playQueuePosition]);
      this.togglePlay();
    }

    if (this.audio.ended) {
      this.nextSong();
    }
  }

  togglePlay() {
    if (!this.props.playing) {
      this.audio.play().then(() => {
        this.duration = this.audio.duration;
        this.updateTimeline();
        this.props.playSong();
      });
    } else {
      this.audio.pause();
      this.props.pauseSong();
    }
  }

  updateTimeline() {
    this.audio.ontimeupdate = () => {
      this.setState({ elapsed: this.audio.currentTime });
      this.movePlayhead();
    };
  }

  movePlayhead() {
    const playPercent = (this.state.elapsed / this.duration) * 100;
    this.playhead.style.marginLeft = playPercent + '%';
  }

  scrollPlayback(e) {
    e.preventDefault();
    e.stopPropagation();

    const timelineWidth = this.scrollbar.getBoundingClientRect().width;
    const timelineLeft = this.scrollbar.getBoundingClientRect().left;
    const clickPos = (e.clientX - timelineLeft) / timelineWidth;

    this.audio.currentTime = this.duration * clickPos;
    this.setState({ elapsed: this.audio.currentTime });
  }

  parseTime(time) {
    const duration = Math.floor(time);
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration) - (minutes * 60);

    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutesString}:${secondsString}`;
  }

  nextSong() {
    const playQueuePosition = this.state.playQueuePosition + 1;
    if (playQueuePosition >= this.props.playQueue.length) {
      this.props.clearPlayQueue();
      this.props.pauseSong();
      this.togglePlay();
      this.setState({ playQueuePosition: 0 });
    } else {
      this.props.receiveCurrentSong(this.props.playQueue[playQueuePosition]);
      this.props.pauseSong();
      this.setState({ playQueuePosition });
    }
  }

  render() {
    let pButtonUrl = this.props.playing ? window.images.pause : window.images.play;

    let audioUrl;
    if (this.props.playQueue.length > 0) {
      audioUrl = this.props.playQueue[this.state.playQueuePosition].audioUrl;
    }

    return(
      <div className="audio-player">

        <audio id="audio" src={ audioUrl } ref={ audio => { this.audio = audio; } }></audio>

        <div className="song-controls">
          <img src={ pButtonUrl } className="p-button" onClick={ this.togglePlay } />
          <img src={ window.images.nextSong } className="next-song" onClick={ this.nextSong }/>
        </div>

        <div className="timeline">
          <p>{ this.parseTime(this.state.elapsed) }</p>
          <div id="scrollbar" onClick={ this.scrollPlayback } ref={ scrollbar => { this.scrollbar = scrollbar; } }>
            <div id="playhead" ref={ playhead => { this.playhead = playhead; } }></div>
          </div>
          <p>{ this.parseTime(this.duration) }</p>
        </div>
      </div>
    );
  }
}

export default AudioPlayer;
