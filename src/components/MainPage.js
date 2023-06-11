import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import './MainPage.scss';
import 'react-circular-progressbar/dist/styles.css';

const MainPage = () => {
  const [workScope, setWorkScope] = useState('');
  const [deadline, setDeadline] = useState('');
  const [sleepingHours, setSleepingHours] = useState(8);
  const [otherActivitiesHours, setOtherActivitiesHours] = useState(0);
  const [ableToComplete, setAbleToComplete] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState(0);
  const [workScopeError, setWorkScopeError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [formError, setFormError] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  const calculateHandler = () => {
    const totalHours = parseInt(workScope);
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const remainingDays = calculateRemainingDays(today, deadlineDate);
    const percentageDaysLeft = Math.min(Math.round((remainingDays / 100) * 100), 100);
    setDaysLeft(percentageDaysLeft);
    const availableHours = 24 - sleepingHours - otherActivitiesHours;

    let hasError = false;
    if (!workScope) {
      setWorkScopeError('This input is required');
      hasError = true;
    } else if (totalHours <= 0) {
      setWorkScopeError('Scope of work must be a positive number');
      hasError = true;
    } else {
      setWorkScopeError('');
    }

    if (!deadline) {
      setDeadlineError('This input is required');
      hasError = true;
    } else if (deadlineDate <= today) {
      setDeadlineError('Deadline must be in the future');
      hasError = true;
    } else {
      setDeadlineError('');
    }

    if (hasError) {
      setFormError('Please fix the errors in the form');
      return;
    } else {
      setFormError('');
    }

    if (remainingDays > 0) {
      const percentage = Math.min(Math.round((totalHours / (totalHours + remainingDays * availableHours)) * 100), 100);
      setCompletionPercentage(percentage);
      const hoursPerDay = Math.ceil(totalHours / remainingDays);

      if (hoursPerDay > 12 || totalHours > remainingDays * availableHours) {
        setAbleToComplete(false);
        setHoursPerDay(0);
      } else {
        setAbleToComplete(true);
        setHoursPerDay(hoursPerDay);
      }
    } else {
      setAbleToComplete(false);
      setHoursPerDay(0);
      setCompletionPercentage(0);
    }

    setShowForm(false);
    setShowResult(true);
  };

  const calculateRemainingDays = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    let totalDays = Math.round(Math.abs((startDay - endDay)/ oneDay));

    let remainingDays = 0;
    for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(startDay.getTime() + i * oneDay);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        remainingDays++;
      }
    } 

    return remainingDays;
  };

  const calculateAgainHandler = () => {
    setShowForm(true);
    setShowResult(false);

    setWorkScope('');
    setDeadline('');
    setSleepingHours(8);
    setOtherActivitiesHours(0);
  };


  const sleepingHoursHandler = (event) => {
    const value = parseInt(event.target.value);
    if (value >= 6 && value <= 12) {
    setSleepingHours(value);
    }
  };


  const otherActivitiesHandler = (event) => {
    const value = parseInt(event.target.value);
    if (value >= 0 && value <= 10) {
    setOtherActivitiesHours(value);
    }
  };

  const getSleepingColor = () => '#4CAF50';
  const getOtherActivitiesColor = () => '#FFC107';
  const getWorkColor = () => '#F44336'  

  return (
    <div className="form">
    <h1 className="calculator-title">Work Completion Calculator</h1>

    {formError && <p className="form-error">{formError}</p>}

    {showForm && (
      <>
        <div className="input-wrapper">
          <label className="form-label">Scope of Work (in hours):</label>
          <input
            className={`input ${workScopeError ? 'error-input' : ''}`}
            type="number"
            value={workScope}
            onChange={(event) => setWorkScope(event.target.value)}
          />
          {workScopeError && <p className="error-message">{workScopeError}</p>}
        </div>
        <div className="input-wrapper">
          <label className="form-label">Deadline:</label>
          <input
            className={`input ${deadlineError ? 'error-input' : ''}`}
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
          {deadlineError && <p className="error-message">{deadlineError}</p>}
        </div>
        <div className="input-wrapper">
          <label className="form-label">Sleeping Hours:</label>
          <input
            className="input"
            type="number"
            value={sleepingHours}
            onChange={sleepingHoursHandler}
            min="0"
            max="12"
          />
        </div>
        <div className="input-wrapper">
          <label className="form-label">Other Activities Hours:</label>
          <input
            className="input"
            type="number"
            value={otherActivitiesHours}
            onChange={otherActivitiesHandler}
            min="0"
            max="10"
          />
        </div>
        <button type="submit" className="submit-button" onClick={calculateHandler}>
          Calculate
        </button>
      </>
    )}

    {showResult && (
      <>
        {!ableToComplete && (
          <p className="negative-result">
            {hoursPerDay === 0 ? (
              ":( You may not be able to complete the work within the given deadline."
            ) : (
              <>
                ":( You may not have enough time to complete the work within the given deadline."
                {otherActivitiesHours > 0 && <span> Too many hours are spent on other activities.</span>}
                {hoursPerDay > 12 && <span> The allocated hours per day exceed 12 hours.</span>}
                Adjust the scope of work or allocate more time to increase the chances of completion.
              </>
            )}
          </p>
        )}
        {ableToComplete && (
          <>
            <div className="progress-bar-wrapper">
              <div className="circular-progress">
                <CircularProgressbar
                  value={(sleepingHours / 24) * 100}
                  text={`${sleepingHours}h`}
                  strokeWidth={10}
                  styles={buildStyles({
                    trailColor: '#E0E0E0',
                    pathColor: getSleepingColor(),
                  })}
                />
                <div className="progress-bar-label">for sleeping</div>
                <CircularProgressbar
                  value={(otherActivitiesHours / 24) * 100}
                  text={`${otherActivitiesHours}h`}
                  strokeWidth={10}
                  styles={buildStyles({
                    trailColor: '#E0E0E0',
                    pathColor: getOtherActivitiesColor(),
                  })}
                />
                <div className="progress-bar-label">for other activities</div>
                <CircularProgressbar
                  value={(hoursPerDay / 24) * 100}
                  text={`${hoursPerDay}h`}
                  strokeWidth={10}
                  styles={buildStyles({
                    trailColor: '#E0E0E0',
                    pathColor: getWorkColor(),
                  })}
                />
                <div className="progress-bar-label">for work</div>
                <div className="days-left-text">
                  <p className="days-left-number">{daysLeft}</p>
                  <p className="days-left-label">{daysLeft === 1 ? 'day' : 'days'} left</p>
                </div>
              </div>
            </div>
            <p className="success-result">
              <span className='word-success'>Success!</span> You will be able to complete the work within the given deadline.
            </p>
            <p className="success-result">
              Allocate <span className='text-hours'>{hoursPerDay}</span> hours per day for work.
            </p>
          </>
        )}
        <button className="calculate-again-button" onClick={calculateAgainHandler}>
          Calculate Again
        </button>
      </>
      )}
    </div>
  );
};

export default MainPage;