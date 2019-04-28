'use strict';

(function($) {
  var calendarEl = document.getElementById('calendar');
  var eventName = document.getElementById('eventName');
  var startTime = document.getElementById('startTime');
  var endTime = document.getElementById('endTime');
  var allDay = document.getElementById('allday');
  var courseDesc = document.getElementById('courseDesc');
  var certifiedBy = document.getElementById('certifiedBy');
  var extUrl = document.getElementById('extUrl');
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
  document.getElementById('eventDetailsForm').addEventListener('submit', function(e) {
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
  document.getElementById('updateEventBtn').addEventListener('click', function(e) {
    e.preventDefault();
    $('#eventDetailsModal').modal('hide');

    eventName.value = EventState.title;
    eventName.setAttribute('readonly', true);
    startTime.value = EventState.start;
    endTime.value = EventState.end;
    if (
      EventState.end &&
      moment(EventState.start).format('HH:mm') === '00:00' &&
      moment(EventState.end).format('HH:mm') === '00:00'
    ) {
      allday.checked = true;
    } else if (!EventState.end && moment(EventState.start).format('HH:mm') === '00:00') {
      allday.checked = true;
    } else {
      allday.checked = false;
    }
    courseDesc.value = EventState.course_desc;
    certifiedBy.value = EventState.certified_by;
    extUrl.value = EventState.url;

    document.querySelector('#addEventModal .modal-title').innerHTML = 'Update Event';
    isUpdating = true;
    $('#addEventModal').modal('show');
  });

  /**
   *  Add event/Update event form submit button listener
   */
  document.getElementById('addEventForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var data = new FormData();

    data.append('start', startTime.value);
    data.append('courseDesc', courseDesc.value);
    data.append('certifiedBy', certifiedBy.value);

    if (endTime.value.trim() !== '') {
      data.append('end', endTime.value);
    }
    data.append('url', extUrl.value);
    data.append('allDay', allDay.checked ? '1' : '0');

    var reqUrl = '';

    if (isUpdating) {
      reqUrl = 'events/updateEvent/' + EventState.id;
    } else {
      reqUrl = 'events/addEvent';
      data.append('eventName', eventName.value);
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
              title: eventName.value,
              start: startTime.value,
              end: endTime.value
            };
            if (extUrl.value) {
              calendar.addEvent(Object.assign(newEvent, { url: extUrl.value }));
            } else {
              calendar.addEvent(newEvent);
            }
          } else {
            calendar.refetchEvents();
          }

          allDay.checked = false;
          eventName.value = '';
          startTime.value = '';
          endTime.value = '';
          extUrl.value = '';
          courseDesc.value = '';
          certifiedBy.value = '';

          $('#addEventModal').modal('hide');
        }
      });
  });

  /**
   * All day or not button listener
   */
  document.getElementById('allday').addEventListener('change', function() {
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
  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],
    customButtons: {
      addBtn: {
        text: 'Add Event',
        click: function() {
          allDay.checked = false;
          eventName.value = '';
          startTime.value = '';
          endTime.value = '';
          extUrl.value = '';
          courseDesc.value = '';
          certifiedBy.value = '';

          isUpdating = false;
          eventName.removeAttribute('readonly');
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
    eventResize: function(eventResizeInfo) {
      updateDateTime(eventResizeInfo.event);
    },
    eventDrop: function(info) {
      updateDateTime(info.event);
    },
    eventClick: function(eventClickInfo) {
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
            document.getElementById('eventName2').value = res.body.title;
            document.getElementById('startTime2').value = res.body.start;
            document.getElementById('endTime2').value = res.body.end;
            if (res.body.allDay === 1) {
              document.getElementById('tick').classList.remove('hidden');
              document.getElementById('cross').classList.add('hidden');
            } else {
              document.getElementById('tick').classList.add('hidden');
              document.getElementById('cross').classList.remove('hidden');
            }
            document.getElementById('courseDesc2').value = res.body.course_desc;
            document.getElementById('certifiedBy2').value = res.body.certified_by;
            document.getElementById('extUrl2').value = res.body.url;

            $('#eventDetailsModal').modal('show');
          }
        });
    },
    events: {
      url: 'events/getEvents',
      failure: function(e) {
        if (JSON.parse(e.xhr.response).message) {
          var message = JSON.parse(e.xhr.response).message;
          alert(message);
        } else {
          alert(e.message);
        }
      }
    },
    loading: function(bool) {
      document.getElementById('loading').style.display = bool ? 'block' : 'none';
    }
  });

  calendar.render();
})(jQuery);
