import { useRef, useEffect, useState } from 'react';
import './App.css';

const year = new Date().getFullYear();

const is_leap = (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);

const MILLISECONDS_TO_SECONDS = 1000;
const MILLISECONDS_TO_MINUTES = 1000 * 60;
const MILLISECONDS_TO_HOURS   = 1000 * 60 * 60;
const MILLISECONDS_TO_DAYS    = 1000 * 60 * 60 * 24;
const MILLISECONDS_TO_YEARS   = 1000 * 60 * 60 * 24 * (is_leap ? 366 : 355);
const ACTION = {
  PAUSE: 'Pause',
  RESUME: 'Resume',
};

function App() {

  const remove_unit = (id) => {
    let duplicate = [...units];
    const index = duplicate.findIndex((elem) => id === elem.id);
    if (index !== -1) {
      duplicate.splice(index, 1);
      set_units(duplicate);
    }
  }

  const [units, set_units] = useState([]);

  const add_units = () => {

    const id = Date.now();
    let duplicate = units.concat([{
      id,
      component: <SelfContainedUnit
        id={id}
        key={id}
        remove_unit={remove_unit}
      />
    }]);
    set_units(duplicate);

  }

  const render_units = () => {
    return units.map((item) => item.component);
  }

  const log = () => {
    console.log(units);
  }

  return (
    <>
      <button onClick={add_units}>Add</button>
      <button onClick={log}>Log</button>
      {render_units()}
    </>
  );
  
}

function SelfContainedUnit(params) {

  const [time, set_time] = useState(get_default_date());

  const on_change = (d) => {
    
    const date = new Date(
      d.target.value + 'Z',
    );

    if (!isNaN(date.getTime())) {

      set_time(date);

    }
  };

  const remove = () => {
    params.remove_unit(params.id);
  }

  return (
    <div>
      <input 
        type='datetime-local' 
        value={format_input_time(time)}
        onChange={on_change}
      />
      &nbsp;
      <button onClick={remove}>X</button>
      <br/>
      <TimeLeft time={time} />
    </div>
  );

}

function TimeLeft(params) {

  const interval = params.interval ?? 1000;
  const [action, set_action] = useState(ACTION.PAUSE);
  const [time_left, set_time_left] = useState(
    calculate_remaining_milliseconds(params.time),
  );
  let timer_id = useRef();

  useEffect(() => {

    stop_timer();

    set_time_left(
      calculate_remaining_milliseconds(params.time),
    );

    start_timer();

  }, [params.time]);

  useEffect(() => {

    start_timer();

    return () => {

      stop_timer();

    }

  }, []);

  const start_timer = () => {

    if (timer_id.current) {

      stop_timer();

    }

    timer_id.current = setInterval(() => {

      set_time_left(
        calculate_remaining_milliseconds(params.time),
      );

    }, interval);

  };

  const stop_timer = () => {

    clearInterval(timer_id.current);

  }

  if (!(params.time instanceof Date)) {

    return (
      <>Not a Date!</>
    );

  }

  const do_action = () => {

    if (action === ACTION.PAUSE) {
      
      set_action(ACTION.RESUME);
      
      stop_timer();

    } else if (action === ACTION.RESUME) {

      set_action(ACTION.PAUSE)
      
      start_timer();

    }

  }

  return (
    <>
      <button style={{ width: '80px' }} onClick={do_action}>{action}</button>
      &nbsp;
      <span>
        {format_milliseconds(time_left, 'DAYS')} days&nbsp;
        {format_milliseconds(time_left, 'HOURS')} hours&nbsp;
        {format_milliseconds(time_left, 'SECONDS')} seconds&nbsp;
        {time_left} milliseconds
      </span>
    </>
  );

}

function calculate_remaining_milliseconds(time) {

  if (!(time instanceof Date)) {

    console.warn('Not a valid argument')
    return 0;

  }

  const remaining_milliseconds = time.getTime() - new Date().getTime();

  if (remaining_milliseconds < 0) {

    return -1;

  }

  return remaining_milliseconds;

}

function format_milliseconds(milliseconds, to) {

  switch (to) {
    case 'YEARS':
      return Math.floor(milliseconds / MILLISECONDS_TO_YEARS);
    case 'MONTHS':
      console.warn('Unimplemented');
      return milliseconds;
    case 'DAYS':
      return Math.floor(milliseconds / MILLISECONDS_TO_DAYS);
    case 'HOURS':
      return Math.floor(milliseconds / MILLISECONDS_TO_HOURS);
    case 'MINUTES':
      return Math.floor(milliseconds / MILLISECONDS_TO_MINUTES);
    case 'SECONDS':
      return Math.floor(milliseconds / MILLISECONDS_TO_SECONDS);
    default:
      console.warn('Incorrect argument \'to\'');
      return milliseconds;
  }

}

function get_default_date() {

  const today = new Date().getTime();

  const addendum = 67 * 24 * 60 * 60 * 1000;

  return new Date(today + addendum);

}

function format_input_time(date) {

  if (isNaN(date.getTime())) {

    console.warn('Invalid argument for date');
    return date;

  }
  
  const str = date.toISOString();
  return str.slice(0, str.length - 1);

}

export default App;
