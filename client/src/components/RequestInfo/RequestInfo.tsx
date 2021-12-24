import React from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';

import { useSelector, useDispatch } from 'react-redux';
import { setProjectName, setCheckoutTime, setReturnTime } from '../../redux';

interface RequestInfoProps {
  orientation?: 'row' | 'column';
  readOnly?: boolean;
}

const RequestInfo: React.FC<RequestInfoProps> = ({
  orientation = 'column',
  readOnly = false,
}) => {
  const [projectName, checkoutTime, returnTime] = useSelector((state: any) => {
    return [
      state.cart.projectName,
      state.cart.checkoutTime,
      state.cart.returnTime,
    ];
  });
  const dispatch = useDispatch();

  return (
    <Stack direction={orientation} spacing={2}>
      <TextField
        label="Project Name"
        value={projectName}
        onChange={(event) => {
          dispatch(setProjectName(event.target.value));
        }}
        InputProps={{
          readOnly: readOnly,
        }}
      ></TextField>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="Checkout Time"
        value={checkoutTime}
        onChange={(newCheckoutTime) => {
          dispatch(setCheckoutTime(newCheckoutTime));
        }}
        minDateTime={new Date()}
        readOnly={readOnly}
        components={{ OpenPickerIcon: undefined }}
      />
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="Return Time"
        value={returnTime}
        onChange={(newReturnTime) => {
          dispatch(setReturnTime(newReturnTime));
        }}
        minDateTime={checkoutTime || new Date()}
        maxDateTime={
          checkoutTime &&
          new Date(checkoutTime).setDate(checkoutTime.getDate() + 2)
        }
        readOnly={readOnly}
      />
    </Stack>
  );
};

export default RequestInfo;
