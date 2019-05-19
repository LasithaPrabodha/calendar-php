<?php

/**
 * Class which collects data comming from the db and populate to the view
 * 
 * Inherits controller class
 */
class EventsController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        if ($this->session->isEmpty()) {
            $response = array("status" => false, "message" => 'Unauthorized access.');
            $this->send(401, $response);
        } else if ($this->session->get('type') != 'supe') {
            $response = array("status" => false, "message" => 'Unauthorized access.');
            $this->send(401, $response);
        }

        $this->model('events');
    }

    /**
     * Displays the calendar view for the user
     */
    public function index()
    {
        $this->view('calendar');
    }

    /**
     * Check event ID validity  
     * Sends an error message with status code 400 if invalid
     * 
     * @param int $id
     * 
     * @return 
     */
    private function checkID($id)
    {
        if ($id == 0) {
            $response = array("status" => false, "message" => 'Invalid ID');
            $this->send(400, $response);
        }
    }

    /**
     * Collect single event details from the db
     * 
     * @param string $id
     * 
     */
    public function getEvent($id)
    {
        $id = (int)$id;
        $this->checkID($id);

        $event = $this->model->getEvent($id);

        $this->send(200, $event);
    }

    /**
     * Collect all events from the db
     */
    public function getEvents()
    {
        if ($this->input->get('start') === null || $this->input->get('end')  === null) {
            $response = array("status" => false, "message" => 'Please provide necessary data.');

            $this->send(400, $response);
        }

        $reqData = array('start' => $this->input->get('start'), 'end' => $this->input->get('end'));

        $events = $this->model->getEvents($reqData);

        $this->send(200, $events);
    }

    /**
     * Create a new event in the db
     */
    public function addEvent()
    {
        if ($this->input->post('start') === null || $this->input->post('eventName') === null) {
            $response = array("status" => false, "message" => 'Please provide necessary data.');

            $this->send(400, $response);
        }

        $reqData = array(
            'start' => $this->input->post('start'),
            'event_name' => $this->input->post('eventName'),
            'created_by' => $this->session->get('username'),
            'course_desc' => $this->input->post('courseDesc'),
            'certified_by' => $this->input->post('certifiedBy'),
            'all_day_event' => $this->input->post('allday'),
            'end' => $this->input->post('end')
        );

        $added = $this->model->addEvent($reqData);

        if ($added === true) {
            $response = array("status" => true, "message" => 'Event added.');
            $this->send(200, $response);
        } else {
            $response = array("status" => false, "message" => 'Event not added.');
            $this->send(500, $response);
        }
    }

    /**
     * Update details stored in the db for a single event
     * 
     * @param string $id
     * 
     */
    public function updateEvent($id)
    {
        $id = (int)$id;
        $this->checkID($id);

        if ($this->input->post('start') === null) {
            $response = array("status" => false, "message" => 'Please provide necessary data.');

            $this->send(400, $response);
        }

        $reqData = array(
            'start' => $this->input->post('start'),
            'id' => $id,
            'updated_by' => $this->session->get('username'),
            'course_desc' => $this->input->post('courseDesc'),
            'certified_by' => $this->input->post('certifiedBy'),
            'all_day_event' => (int)$this->input->post('allday'),
            'end' => $this->input->post('end'),
        );

        $updated = $this->model->updateEvent($reqData);
        if ($updated === true) {
            $response = array("status" => true, "message" => 'Event updated.');
            $this->send(200, $response);
        } else {
            $response = array("status" => false, "message" => 'Event not updated.');
            $this->send(500, $response);
        }
    }

    /**
     * Updates date & time for a single event
     * 
     * @param string $id
     */
    public function updateEventDateTime($id)
    {
        $id = (int)$id;

        $this->checkID($id);

        if ($this->input->post('start') === null) {
            $response = array("status" => false, "message" => 'Please provide necessary data.');

            $this->send(400, $response);
        }

        $reqData = array(
            'id' => $id,
            'updated_by' => $this->session->get('username'),
            'all_day_event' => (int)$this->input->post('allday'),
            'start' => $this->input->post('start'),
            'end' => $this->input->post('end'),
        );
        
        $added = $this->model->updateEventDateTime($reqData);
        if ($added === true) {
            $response = array("status" => true, "message" => 'Event updated.');
            $this->send(200, $response);
        } else {
            $response = array("status" => false, "message" => 'Event not updated.');
            $this->send(500, $response);
        }
    }


    /**
     * Delete a single event from the db
     * 
     * @param string $id
     */
    public function deleteEvent($id)
    {
        $id = (int)$id;
        $this->checkID($id);

        $deleted = $this->model->deleteEvent($id);
        if ($deleted == true) {
            $response = array('status' => true, 'message' => 'Event deleted.');
            $this->send(200, $response);
        } else {
            $response = array('status' => false, 'message' => 'Event not deleted.');
            $this->send(500, $response);
        }
    }
}
