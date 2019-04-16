<?php

/**
 * Class which controls the Database CRUD operations
 * 
 * Inherits the Database class
 * 
 */
class Events extends Database
{
    protected $events = [];
    protected $selected_event = [];

    public function getEvents($data)
    {
        /* create a prepared statement */
        if ($stmt = $this->db->prepare("SELECT `id`, `title`, `start`, `end`, `url`, `all_day_event` as `allDay` FROM calendar WHERE `start` > ? AND (`end` <= ? OR `end` IS NULL)  AND active = 1")) {

            /* bind parameters for markers */
            $stmt->bind_param("ss", $data['start'], $data['end']);

            /* execute query */
            $stmt->execute();

            /* bind result variables */
            $result =  $stmt->get_result();

            /* fetch value */
            while ($row =  $result->fetch_assoc()) {
                if ($row['url'] == null) {
                    unset($row['url']);
                }
                $this->events[] = $row;
            }

            /* close statement */
            $stmt->close();
        }
        return $this->events;
    }

    public function addEvent($data)
    {
        /* create a prepared statement */
        if ($stmt = $this->db->prepare("INSERT INTO calendar (`title`, `created_by`, `start`, `end`, `url`, `course_desc`, `certified_by`, `all_day_event`) VALUES (?,?,?,?,?,?,?,?)")) {

            /* bind parameters for markers */
            $stmt->bind_param(
                "sssssssi",
                $data['event_name'],
                $data['created_by'],
                $data['start'],
                $data['end'],
                $data['url'],
                $data['course_desc'],
                $data['certified_by'],
                $data['all_day_event']

            );

            /* execute query */
            $stmt->execute();

            if ($stmt->insert_id !== 0) {
                /* close statement */
                $stmt->close();
                return true;
            }
            $stmt->close();
            return false;
        }
    }

    public function getEvent($id)
    {
        /* create a prepared statement */
        if ($stmt = $this->db->prepare("SELECT `id`, `title`, `all_day_event` as `allDay`,`start`, `end`, `url`, `course_desc`, `certified_by` FROM calendar WHERE `id` = ? AND active = 1")) {

            /* bind parameters for markers */
            $stmt->bind_param("d", $id);

            /* execute query */
            $stmt->execute();

            /* bind result variables */
            $result =  $stmt->get_result();

            /* fetch value */
            $this->selected_event =  $result->fetch_assoc();

            /* close statement */
            $stmt->close();
        }
        return $this->selected_event;
    }

    public function deleteEvent($id)
    {
        /* create a prepared statement */
        // if ($stmt = $this->db->prepare("UPDATE `calendar` SET `active` = '0' WHERE `calendar`.`id` = ?")) {
        if ($stmt = $this->db->prepare("DELETE FROM `calendar` WHERE `id` = ?")) {

            /* bind parameters for markers */
            $stmt->bind_param("d", $id);

            /* execute query */
            $status = $stmt->execute();

            /* close statement */
            $stmt->close();
        }
        return $status;
    }

    public function updateEvent($data)
    {

        /* create a prepared statement */
        if ($stmt = $this->db->prepare("UPDATE `calendar` SET `updated_by`=?, `start`=?,`end`=?,`url`=?,`course_desc`=?,`certified_by`=?, `all_day_event`=?  WHERE `calendar`.`id` = ?")) {

            /* bind parameters for markers */
            $stmt->bind_param(
                "ssssssii",
                $data['updated_by'],
                $data['start'],
                $data['end'],
                $data['url'],
                $data['course_desc'],
                $data['certified_by'],
                $data['all_day_event'],
                $data['id']
            );
            /* execute query */
            $status = $stmt->execute();

            /* close statement */
            $stmt->close();
        }
        return $status;
    }

    public function updateEventDateTime($data)
    {

        /* create a prepared statement */
        if ($stmt = $this->db->prepare("UPDATE `calendar` SET `updated_by`=?,`all_day_event`=?, `start`=?,`end`=?  WHERE `calendar`.`id` = ?")) {

            /* bind parameters for markers */
            $stmt->bind_param(
                "sissi",
                $data['updated_by'],
                $data['all_day_event'],
                $data['start'],
                $data['end'],
                $data['id']
            );
            /* execute query */
            $status = $stmt->execute();

            /* close statement */
            $stmt->close();
        }
        return $status;
    }
}
