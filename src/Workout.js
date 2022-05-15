import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css'
import './index.css';
import { InputNumber, Col, Row, Button } from 'antd';

function Workout() {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false)
  const [sets, setSets] = useState(0)
  const [timeBetweenSet, setTimeBetweenSet] = useState(0)
  const [origTimeBetweenSet, setOrigTimeBetweenSet] = useState(0)
  const [repsTime, setRepsTime] = useState(0)
  const [origRepsTime, setOrigRepsTime] = useState(0)

  const onSetsChange = (value) => {
    setSets(value)
  }

  const onTimeBetweenSetChange = (value) => {
    setTimeBetweenSet(value)
    setOrigTimeBetweenSet(value)
  }

  const onRepsTimeChange = (value) => {
    setRepsTime(value)
    setOrigRepsTime(value)
  }

  const updateWorkout = () => {
    if (paused || (running && sets === 1) || running) {
      setRepsTime(0)
      setOrigRepsTime(0)
      setSets(0)
      setTimeBetweenSet(0)
    }

    setPaused(false)
    setRunning(!running)
  }

  const pauseWorkout = () => {
    if (paused) {
      setRunning(true)
    }

    setPaused(!paused)
  }

  useEffect(() => {
    if (running && sets > 0 && repsTime > 0 && !paused) {
      const token = setTimeout(() => {
        setRepsTime(prevTime => prevTime - 1)
      }, 1000)

      return function cleanUp() {
        clearTimeout(token);
      }
    } else if (running && sets > 1 && repsTime === 0 && !paused && timeBetweenSet > 0) {
      const token = setTimeout(() => {
        setTimeBetweenSet(prevTime => prevTime - 1)
      }, 1000)

      return function cleanUp() {
        clearTimeout(token);
      }
    } else if (running && sets > 1 && repsTime === 0 && !paused && timeBetweenSet === 0) {
      setSets(prev => prev - 1)
      setRepsTime(origRepsTime)
      setTimeBetweenSet(origTimeBetweenSet)
    } else if (running && sets === 1 && repsTime === 0 && !paused) {
      updateWorkout()
    }
  })

  const formComponent = () => {
    return (
      <Row justify="center">
        <Col span={12}>
          <Row>
            <Col span={12}>
              <h1>Sets</h1>
            </Col>
            <Col span={12}>
              <InputNumber min={1} onChange={onSetsChange} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <h1>Time between Sets (seconds)</h1>
            </Col>
            <Col span={12}>
              <InputNumber min={0} onChange={onTimeBetweenSetChange} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <h1>Reps (seconds)</h1>
            </Col>
            <Col span={12}>
              <InputNumber min={0} onChange={onRepsTimeChange} />
            </Col>
          </Row>
          <Row >
            <Col span={24}>
              <Button disabled={!(repsTime > 0 && sets > 0 && !paused)} block onClick={updateWorkout}>Start Workout</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  const timerComponent = () => {
    return (
      <Row justify="center">
        <Col span={12}>
          <Row>
            <Col span={12}>
              <h1>Sets</h1>
            </Col>
            <Col span={12}>
              <h1>{sets}</h1>
            </Col>
          </Row>
          <Row className={repsTime === 0 || paused ? "break" : ""}>
            <Col span={12}>
              <h1>Time between Sets (seconds)</h1>
            </Col>
            <Col span={12}>
              <h1>{timeBetweenSet}</h1>
            </Col>
          </Row>
          <Row className={running && !paused && repsTime > 0 ? "running" : ""}>
            <Col span={12}>
              <h1>Reps (seconds)</h1>
            </Col>
            <Col span={12}>
              <h1>{repsTime}</h1>
            </Col>
          </Row>
          <Row columns={2}>
            <Col span={12}>
              <Button block onClick={updateWorkout}>End Workout</Button>
            </Col>
            <Col span={12}>
              {paused ? <Button block onClick={pauseWorkout}>Resume Workout</Button>
                : <Button block onClick={pauseWorkout}>Pause Workout</Button>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  return (
    <div>
      {
        running ? timerComponent() : formComponent()
      }
    </div>
  );
}

export default Workout