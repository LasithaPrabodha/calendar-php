'use strict';

(function ($) {

  var q = function(selector) {
    return document.querySelector(selector);
  };

  var delID = 0;
  var EventState = {};
  var isUpdating = false;

  $('#startTime').datetimepicker({
    format: 'YYYY-MM-DD HH:mm'
  });
  $('#endTime').datetimepicker({
    format: 'YYYY-MM-DD HH:mm'
  });

  /**
   *  Update date time function
   */
  function updateDateTime(data) {
    var requestData = new FormData();

    requestData.append('start', moment(data.start).format());
    if (data.end) {
      requestData.append('end', moment(data.end).format());
    }

    if (data.end && moment(data.start).format('HH:mm') === '00:00' && moment(data.end).format('HH:mm') === '00:00') {
      requestData.append('allDay', '1');
    } else if (!data.end && moment(data.start).format('HH:mm') === '00:00') {
      requestData.append('allDay', '1');
    } else {
      requestData.append('allDay', '0');
    }

    var reqUrl = 'events/updateEventDateTime/' + data.id;

    superagent
      .post(reqUrl)
      .send(requestData)
      .set('accept', 'json')
      .end((err, res) => {
        if (err && err.status !== 200) {
          if (!res) {
            alert(err.status + ' ' + err.message);
          } else {
            alert('Sorry... ' + res.body.message);
          }
        } else if (!res.body) {
          alert('Sorry... Request Failed');
        } else {
        }
      });
  }

  /**
   * Delete a event
   */
  q('#eventDetailsForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (confirm('Are you sure you want to delete this event?')) {
      superagent
        .del('events/deleteEvent/' + delID)
        .set('accept', 'json')
        .end((err, res) => {
          if (err && err.status !== 200) {
            if (!res) {
              alert(err.status + ' ' + err.message);
            } else {
              alert('Sorry... ' + res.body.message);
            }
          } else {
            calendar.getEventById(delID).remove();
          }
        });
    } else {
    }
    $('#eventDetailsModal').modal('hide');
  });

  /**
   * Open update event modal
   */
  q('#updateEventBtn').addEventListener('click', function (e) {
    e.preventDefault();
    $('#eventDetailsModal').modal('hide');

    q('#eventName').value = EventState.title;
    q('#eventName').setAttribute('readonly', true);
    q('#startTime').value = EventState.start;
    q('#endTime').value = EventState.end;

    if (
      EventState.end &&
      moment(EventState.start).format('HH:mm') === '00:00' &&
      moment(EventState.end).format('HH:mm') === '00:00'
    ) {
      q('#allday').checked = true;
    } else if (!EventState.end && moment(EventState.start).format('HH:mm') === '00:00') {
      q('#allday').checked = true;
    } else {
      q('#allday').checked = false;
    }
    q('#courseDesc').value = EventState.course_desc;
    q('#certifiedBy').value = EventState.certified_by;
    q('#extUrl').value = EventState.url;

    document.querySelector('#addEventModal .modal-title').innerHTML = 'Update Event';
    isUpdating = true;

    if (q('#allday').checked) {
      $('#startTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD');
      $('#endTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD');
    } else {
      $('#startTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD HH:mm');
      $('#endTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD HH:mm');
    }
    $('#addEventModal').modal('show');
  });

  /**
   *  Add event/Update event form submit button listener
   */
  q('#addEventForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var data = new FormData();

    data.append('start', q('#startTime').value);
    data.append('courseDesc', q('#courseDesc').value);
    data.append('certifiedBy', q('#certifiedBy').value);

    if (q('#endTime').value.trim() !== '') {
      data.append('end', q('#endTime').value);
    }
    data.append('url', q('#extUrl').value);
    data.append('allDay', q('#allday').checked ? '1' : '0');

    var reqUrl = '';

    if (isUpdating) {
      reqUrl = 'events/updateEvent/' + EventState.id;
    } else {
      reqUrl = 'events/addEvent';
      data.append('eventName', q('#eventName').value);
    }

    superagent
      .post(reqUrl)
      .send(data)
      .set('accept', 'json')
      .end((err, res) => {
        if (err && err.status !== 200) {
          if (!res) {
            alert(err.status + ' ' + err.message);
          } else {
            alert('Sorry... ' + res.body.message);
          }
        } else if (!res.body) {
          alert('Sorry... Request Failed');
        } else {
          if (!isUpdating) {
            var newEvent = {
              title: q('#eventName').value,
              start: q('#startTime').value,
              end: q('#endTime').value
            };
            if (q('#extUrl').value) {
              calendar.addEvent(Object.assign(newEvent, { url: q('#extUrl').value }));
            } else {
              calendar.addEvent(newEvent);
            }
          } else {
            calendar.refetchEvents();
          }

          q('#allday').checked = false;
          q('#eventName').value = '';
          q('#startTime').value = '';
          q('#endTime').value = '';
          q('#extUrl').value = '';
          q('#courseDesc').value = '';
          q('#certifiedBy').value = '';

          $('#addEventModal').modal('hide');
        }
      });
  });

  /**
   * All day or not button listener
   */
  q('#allday').addEventListener('change', function () {
    if (this.checked) {
      $('#startTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD');
      $('#endTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD');
    } else {
      $('#startTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD HH:mm');
      $('#endTime')
        .data('DateTimePicker')
        .format('YYYY-MM-DD HH:mm');
    }
  });

  /**
   * Calendar object which controls the calendar behaviour
   */
  var calendar = new FullCalendar.Calendar(q('#calendar'), {
    plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],
    customButtons: {
      addBtn: {
        text: 'Add Event',
        click: function () {
          q('#allday').checked = false;
          q('#eventName').value = '';
          q('#startTime').value = '';
          q('#endTime').value = '';
          q('#extUrl').value = '';
          q('#courseDesc').value = '';
          q('#certifiedBy').value = '';

          isUpdating = false;
          q('#eventName').removeAttribute('readonly');
          $('#addEventModal').modal('show');
        }
      }
    },
    header: {
      left: 'prev,next today, addBtn',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    defaultDate: moment().format('YYYY-MM-DD'),
    editable: true,
    navLinks: true,
    eventLimit: true,
    selectable: true,
    weekNumbers: true,
    eventResize: function (eventResizeInfo) {
      updateDateTime(eventResizeInfo.event);
    },
    eventDrop: function (info) {
      updateDateTime(info.event);
    },
    eventClick: function (eventClickInfo) {
      eventClickInfo.jsEvent.preventDefault();
      if (eventClickInfo.event.url) {
        window.open(eventClickInfo.event.url);
        window.focus();
      }
      superagent
        .get('events/getEvent/' + eventClickInfo.event.id)
        .set('accept', 'json')
        .end((err, res) => {
          if (err && err.status !== 200) {
            EventState = {};
            if (!res) {
              alert(err.status + ' ' + err.message);
            } else {
              alert('Sorry... ' + res.body.message);
            }
          } else {
            EventState = res.body;
            delID = eventClickInfo.event.id;
            q('#eventName2').value = res.body.title;
            q('#startTime2').value = res.body.start;
            q('#endTime2').value = res.body.end;
            if (res.body.allDay === 1) {
              q('#tick').classList.remove('hidden');
              q('#cross').classList.add('hidden');
            } else {
              q('#tick').classList.add('hidden');
              q('#cross').classList.remove('hidden');
            }
            q('#courseDesc2').value = res.body.course_desc;
            q('#certifiedBy2').value = res.body.certified_by;
            q('#extUrl2').value = res.body.url;

            $('#eventDetailsModal').modal('show');
          }
        });
    },
    events: {
      url: 'events/getEvents',
      failure: function (e) {
        if (JSON.parse(e.xhr.response).message) {
          var message = JSON.parse(e.xhr.response).message;
          alert(message);
        } else {
          alert(e.message);
        }
      }
    },
    loading: function (bool) {
      q('#loading').style.display = bool ? 'block' : 'none';
    }
  });

  calendar.render();
})(jQuery);
