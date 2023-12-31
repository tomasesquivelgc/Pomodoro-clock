import React, { Component } from 'react';

class PomodoroClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workTime: 25 * 60,  // Work time in seconds
      breakTime: 5 * 60,  // Break time in seconds
      currentTime: 25 * 60,
      isRunning: false,
      isBreak: false, // Added to track if it's a break
    };
    // Create a ref for the audio element
    this.audioRef = React.createRef();
  }

  componentDidMount() {
    // Start the timer when the component mounts
    this.startTimer();
  }

  componentWillUnmount() {
    // Clean up the timer when the component unmounts
    clearInterval(this.timerInterval);
  }

  startTimer = () => {
    this.setState({ isRunning: true });

    this.timerInterval = setInterval(() => {
      if (this.state.currentTime > 0) {
        this.setState((prevState) => ({
          currentTime: prevState.currentTime - 1,
        }));
      } else {
        // Timer has reached 0, switch to break or work time
        if (!this.state.isBreak) {
          // Start a break countdown
          this.playAudio(); // Play the audio when time is up
          alert('Time for a break!');
          this.setState({
            currentTime: this.state.breakTime,
            isBreak: true,
          });
        } else {
          // Start a session countdown
          this.playAudio(); // Play the audio when time is up
          alert('Back to work!');
          this.setState({
            currentTime: this.state.workTime,
            isBreak: false,
          });
        }
      }
    }, 1000); // Update timer every 1 second
  };

  pauseTimer = () => {
    clearInterval(this.timerInterval);
    this.setState({ isRunning: false });
  };

  resetTimer = () => {
    clearInterval(this.timerInterval);
    this.setState({
      workTime: 25 * 60,
      breakTime: 5 * 60,
      currentTime: 25 * 60,
      isRunning: false,
      isBreak: false,
    });
    this.stopAudio(); // Stop and rewind the audio when reset
  };

  playAudio = () => {
    // Play the audio
    if (this.audioRef.current) {
      this.audioRef.current.play();
    }
  };

  stopAudio = () => {
    // Stop and rewind the audio
    if (this.audioRef.current) {
      this.audioRef.current.pause();
      this.audioRef.current.currentTime = 0;
    }
  };

  formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  adjustTime = (type, delta) => {
    if (!this.state.isRunning) {
      const newTime = this.state[type] + delta * 60;
      if (newTime >= 60 && newTime <= 60 * 60) {
        this.setState({
          [type]: newTime,
          currentTime: type === 'workTime' ? newTime : this.state.currentTime,
        });
      }
    }
  };

  render() {
    const { currentTime, isRunning, isBreak } = this.state;
    const timerLabel = isBreak ? 'Break' : 'Session';

    return (
      <>
        <div className='container'>
          <h1>Pomodoro Clock</h1>
          {/* Controls for session and break lengths */}
          <div>
            <div className='lengthControls'>
              <div id="break-controls">
                <p id="break-label">Break Length</p>
                <div className='control'>
                  <button
                    id="break-decrement"
                    onClick={() => this.adjustTime('breakTime', -1)}
                  >
                    Decrease
                  </button>
                  <p id="break-length">{this.state.breakTime / 60}</p>
                  <button
                    id="break-increment"
                    onClick={() => this.adjustTime('breakTime', 1)}
                  >
                    Increase
                  </button>
                </div>
              </div>
              <div id="session-controls">
                <p id="session-label">Session Length</p>
                <div className='control'>
                  <button
                    id="session-decrement"
                    onClick={() => this.adjustTime('workTime', -1)}
                  >
                    Decrease
                  </button>
                  <p id="session-length">{this.state.workTime / 60}</p>
                  <button
                    id="session-increment"
                    onClick={() => this.adjustTime('workTime', 1)}
                  >
                    Increase
                  </button>
                </div> 
              </div>
            </div>
          </div>
          {/* Countdown timer */}
          <div>
            <p id="timer-label">{timerLabel} Time</p>
            <p id="time-left">{this.formatTime(currentTime)}</p>
          </div>
          <audio id="beep" ref={this.audioRef}>
            <source src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <button id="start_stop" onClick={isRunning ? this.pauseTimer : this.startTimer}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button id="reset" onClick={this.resetTimer}>Reset</button>
          <a href="https://github.com/tomasesquivelgc/Pomodoro-clock" className='codeLink'>Link to the code</a>
        </div>
      </>
    );
  }
}

export default PomodoroClock;
