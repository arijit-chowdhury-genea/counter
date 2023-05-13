import { useEffect, useState } from 'react';
import { get_default_name } from './names';
import { capitalize } from './helper';
import './App.css';

let global_callbacks = [];

function do_the_needful() {
  for (let i = 0; i < global_callbacks.length; i++) {
    global_callbacks[i].callback();
  }
}

function register_callback({ id, callback }) {
  const index = global_callbacks.findIndex((elem) => elem.id === id);
  if (index === -1) {
    global_callbacks.push({ id, callback });
  }
}

function deregister_callback(id) {
  global_callbacks = global_callbacks.filter((elem) => elem.id !== id);
}

let global_timer_id = setInterval(() => {
  do_the_needful();
}, 1000);

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
const TIME_UNIT = {
  YEARS: 'YEARS',
  // MONTHS: 'MONTHS',
  DAYS: 'DAYS',
  HOURS: 'HOURS',
  SECONDS: 'SECONDS',
  MILLISECONDS: 'MILLISECONDS',
};

function App() {
  
  const [units, set_units] = useState([]);
  const [default_time_unit, set_default_time_unit] = useState(TIME_UNIT.DAYS);

  const on_time_change = (id, time) => {
    
    set_units(
      units.map((unit) => {
        if (unit.id !== id) {
          return unit;
        } else {
          return {
            ...unit,
            time,
          };
        }
      }),
    );

  };

  const on_name_change = (id, name) => {
    
    set_units(
      units.map((unit) => {
        if (unit.id !== id) {
          return unit;
        } else {
          return {
            ...unit,
            name,
          };
        }
      }),
    );

  };

  const on_time_unit_change = (id, time_unit) => {

    set_units(
      units.map((unit) => {
        if (unit.id !== id) {
          return unit;
        } else {
          return {
            ...unit,
            time_unit,
          };
        }
      }),
    );

  };

  const remove_unit = (id) => {
    let new_state = units.filter((item) => item.id !== id);
    set_units(new_state);
  }

  const add_units = () => {
    let new_state = [];
    for (let i = 0; i < units.length; i++) {
      new_state.push({
        ...units[i],
      });
    }
    const id = Date.now();
    new_state.push({
      id,
      name: get_default_name(),
      time: get_default_date(),
      time_unit: default_time_unit,
    });
    set_units(new_state);
  }

  const render_units = () => {
    return units.map(
      (item) => <SelfContainedUnit
        id={item.id}
        key={item.id}
        name={item.name}
        time={item.time}
        time_unit={item.time_unit}
        remove_unit={remove_unit}
        on_time_change={on_time_change}
        on_name_change={on_name_change}
        on_time_unit_change={on_time_unit_change}
      />
    );
  };

  const reset = () => {
    for (let i = 0; i < units.length; i++) {
      deregister_callback(units[i].id);
    }
    set_units([]);
  }

  const on_default_time_unit_change = (e) => {
    set_default_time_unit(e.target.value);
  }

  return (
    <>
      <button onClick={add_units}>Add</button>
      <button onClick={reset}>Clear All</button>
      <select value={default_time_unit} onChange={on_default_time_unit_change}>
        <TimeUnitOptions />
      </select>
      {render_units()}
    </>
  );
  
}

function SelfContainedUnit(props) {
  
  const on_time_change = (d) => {
    const date = new Date(
      d.target.value + 'Z',
    );

    if (!isNaN(date.getTime())) {

      props.on_time_change(
        props.id,
        date,
      );

    }
  };

  const on_name_change = (e) => {

    props.on_name_change(
      props.id,
      e.target.value,
    );

  };

  const on_time_unit_change = (e) => {

    props.on_time_unit_change(
      props.id,
      e.target.value,
    );

  };

  const remove = () => {
    props.remove_unit(props.id);
  }

  return (
    <div style={{ padding: "5px", margin: "5px", border: "1px solid black" }}>
      <input
        type='text'
        value={props.name}
        onChange={on_name_change}
        style={{ border: "none", fontWeight: "bold" }}
      />
      <br/>
      <span style={{ fontSize: "12px", color: "gray" }}>{props.id}</span>
      <br/>
      <input 
        type='datetime-local' 
        value={format_input_time(props.time)}
        onChange={on_time_change}
      />
      &nbsp;
      <select
        value={props.time_unit}
        onChange={on_time_unit_change}
      >
        <TimeUnitOptions />
      </select>
      &nbsp;
      <button 
        onClick={remove}
      >X</button>
      <br/>
      <TimeLeft
        id={props.id}
        time={props.time}
        time_unit={props.time_unit}
      />
    </div>
  );

}

function TimeUnitOptions() {
  return (
    <>
      {
        Object.values(TIME_UNIT).map(
          (option) => (
            <option key={option} value={option}>{capitalize(option)}</option>
          )
        )
      }
    </>
  )
}

function TimeLeft(params) {

  const [action, set_action] = useState(ACTION.PAUSE);
  const [time_left, set_time_left] = useState(
    calculate_remaining_milliseconds(params.time),
  );

  const callbackRef = () => {
    set_time_left(calculate_remaining_milliseconds(params.time));
  };

  useEffect(() => {

    stop_timer();

    callbackRef();

    start_timer();

  }, [params.time]);

  useEffect(() => {

    start_timer();

    return () => {

      stop_timer();

    }

  }, []);

  const start_timer = () => {

    register_callback({
      id: params.id,
      callback: callbackRef,
    });

  };

  const stop_timer = () => {

    deregister_callback(params.id);

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
        { params.time_unit === TIME_UNIT.YEARS && `${format_milliseconds(time_left, TIME_UNIT.YEARS)} ${TIME_UNIT.YEARS.toLowerCase()}` }
        { params.time_unit === TIME_UNIT.DAYS && `${format_milliseconds(time_left, TIME_UNIT.DAYS)} ${TIME_UNIT.DAYS.toLowerCase()}` }
        { params.time_unit === TIME_UNIT.HOURS && `${format_milliseconds(time_left, TIME_UNIT.HOURS)} ${TIME_UNIT.HOURS.toLowerCase()}` }
        { params.time_unit === TIME_UNIT.SECONDS && `${format_milliseconds(time_left, TIME_UNIT.SECONDS)} ${TIME_UNIT.SECONDS.toLowerCase()}` }
        { params.time_unit === TIME_UNIT.MILLISECONDS && `${format_milliseconds(time_left, TIME_UNIT.MILLISECONDS)} ${TIME_UNIT.MILLISECONDS.toLowerCase()}` }
      </span>
    </>
  );

}

function calculate_remaining_milliseconds(time) {

  if (!(time instanceof Date)) {

    console.warn('Not a valid argument')
    return 0;

  }

  return time.getTime() - new Date().getTime();

}

function format_milliseconds(milliseconds, to) {

  switch (to) {
    case TIME_UNIT.YEARS:
      return Math.floor(milliseconds / MILLISECONDS_TO_YEARS);
    case 'MONTHS':
      console.warn('Unimplemented');
      return milliseconds;
    case TIME_UNIT.DAYS:
      return Math.floor(milliseconds / MILLISECONDS_TO_DAYS);
    case TIME_UNIT.HOURS:
      return Math.floor(milliseconds / MILLISECONDS_TO_HOURS);
    case TIME_UNIT.MINUTES:
      return Math.floor(milliseconds / MILLISECONDS_TO_MINUTES);
    case TIME_UNIT.SECONDS:
      return Math.floor(milliseconds / MILLISECONDS_TO_SECONDS);
    case TIME_UNIT.MILLISECONDS:
      return milliseconds;
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
