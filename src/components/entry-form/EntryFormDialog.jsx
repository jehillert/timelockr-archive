import React from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import moment from 'moment';
import { createEntry } from 'utilities';
import {
  Box,
  DatePicker,
  FormButton,
  TimePicker,
} from 'components';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  dense: {
    marginTop: 16,
  },
  fab: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class EntryFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      content: '',
      selectedDate: new Date(),
      selectedTime: new Date(),
      open: false,
    };
  }

  handleChange = e => (
    this.setState({ [e.target.id]: e.target.value })
  )

  handleClickOpen = () => {
    this.setState({
      description: '',
      content: '',
      selectedDate: new Date(),
      selectedTime: new Date(),
    });

    this.setState({ open: true });
  }

  handleClose = () => (
    this.setState({ open: false })
  )

  handleDateChange = date => (
    this.setState({ selectedDate: date })
  )

  handleSubmit = (event) => {
    event.preventDefault();

    const dbms = process.env.DBMS || 'mysql';

    const {
      content,
      description,
      selectedDate,
      selectedTime,
    } = this.state;

    const {
      refresh,
      userId,
    } = this.props;

    const creationDate = moment().format('YYYY-MM-DD HH:mm');

    const formattedTime = moment(selectedTime).utc().format('HH:mm').toString();
    const formattedDate = moment(selectedDate).utc().format('YYYY-MM-DD').toString();
    const releaseDateTime = `${formattedDate} ${formattedTime}`;
    let releaseDate = moment(releaseDateTime, 'YYYY-MM-DD h:mm').format('YYYY-MM-DD HH:mm');

    if (dbms === 'postgres') {
      releaseDate += '+00';
    }

    const newEntry = {
      userId,
      creationDate,
      releaseDate,
      description,
      content,
    };

    return createEntry(newEntry)
      .then(() => refresh())
      .then(this.handleClose);
  }

  handleTimeChange = time => this.setState({ selectedTime: time });

  render() {
    const { classes } = this.props;
    const {
      content,
      description,
      open,
      selectedDate,
      selectedTime,
    } = this.state;
    return (
      <Box>
        <Fab
          onClick={this.handleClickOpen}
          size='small'
          color='primary'
          aria-label='New Entry'
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
        <Dialog
          aria-labelledby='form-dialog-title'
          open={open}
          onClose={this.handleClose}
          width='26rem'
        >
          <DialogTitle id='form-dialog-title'>New Entry</DialogTitle>
          <DialogContent>
            <TextField
              id='description'
              autoComplete='off'
              css='margin: 8;'
              fullWidth
              label='Enter a description.'
              margin='dense'
              placeholder='(555) 555-5555'
              variant='outlined'
              className={classNames(classes.dense, classes.textField)}
              onChange={this.handleChange}
              value={description}
            />
            <TextField
              id='content'
              autoComplete='off'
              fullWidth
              label='Enter something to lock away.'
              margin='dense'
              multiline
              placeholder={'Ex-girlfriend\'s phone number'}
              rows='4'
              rowsMax='10'
              variant='outlined'
              className={classNames(classes.dense, classes.textField)}
              onChange={this.handleChange}
              value={content}
            />
            <Box flexWrap='nowrap'>
              <>
                <DatePicker
                  handleDateChange={this.handleDateChange}
                  selectedDate={selectedDate}
                />
                <TimePicker
                  handleTimeChange={this.handleTimeChange}
                  selectedTime={selectedTime}
                />
              </>
            </Box>
          </DialogContent>
          <DialogActions>
            <FormButton
              type='button'
              handleSubmit={this.handleClose}
              color='primary'
            >
              Cancel
            </FormButton>
            <FormButton
              type='submit'
              handleSubmit={this.handleSubmit}
              color='primary'
            >
              Submit
            </FormButton>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

EntryFormDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default withStyles(styles)(EntryFormDialog);
