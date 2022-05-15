import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.min.css'
import './index.css';
import { InputNumber, Col, Row, Button, Divider } from 'antd';

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
      setOrigTimeBetweenSet(0)
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
      setRunning(false)
    }
  }, [running, origRepsTime, origTimeBetweenSet, paused, repsTime, sets, timeBetweenSet])

  const formComponent = () => {
    return (
      <>
        <Row className="row" justify="space-between">
          <Col span={11} offset={3}>
            <Row className="row">
              <h1>Sets</h1>
            </Row>
            <Row className="row">
              <h1>Rest per Set</h1>
            </Row>
            <Row className="row">
              <h1>Rep Time</h1>
            </Row>
          </Col>

          <Col span={8} offset={2}>
            <Row className="row2">
              <InputNumber min={1} onChange={onSetsChange} />
            </Row>
            <Row className="row2">
              <InputNumber min={0} onChange={onTimeBetweenSetChange} />
            </Row>
            <Row className="row2">
              <InputNumber min={0} onChange={onRepsTimeChange} />
            </Row>
          </Col>

        </Row >
        <Row justify="center" align="bottom" className="row">
          <Col span={12}>
            <Button className="btn-row" size="large" disabled={!(repsTime > 0 && sets > 0 && !paused)} block onClick={updateWorkout}>Start</Button>
          </Col>
        </Row>
      </>
    );
  }

  const timerComponent = () => {
    return (
      <>
        <Row className="row" justify="space-between">
          <Col span={11} offset={3}>
            <Row className="row">
              <h1>Sets</h1>
            </Row>
            <Row className="row">
              <h1>Rest per Set</h1>
            </Row>
            <Row className="row">
              <h1>Rep Time</h1>
            </Row>
          </Col>

          <Col span={6} offset={4}>
            <Row className="row">
              <h1>{sets} </h1>           
            </Row>
            <Row className="row">
              <h1>{timeBetweenSet} </h1>           
            </Row>
            <Row className="row">
              <h1>{repsTime}</h1>            
            </Row>
          </Col>
        </Row >
        
        <Row justify="center" align="bottom" className="row">
          <Col span={12}>
            {paused ? <Button size="large" className="btn-row" block onClick={pauseWorkout}>Resume</Button>
              : <Button size="large" className="btn-row" block onClick={pauseWorkout}>Pause</Button>
            }          
          </Col>
          <Col span={12}>
            <Button size="large" className="btn-row" block onClick={updateWorkout}>End</Button>       
          </Col>
        </Row>
      </>
    )
  }

  return (
    <div className={ running ? !paused && repsTime > 0 ? "running" : "break" : ""}>
      { running ? 
        timerComponent() : 
        formComponent() }
    </div>
  );
}

export default Workout