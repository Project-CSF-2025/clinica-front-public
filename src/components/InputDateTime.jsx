import React from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import 'dayjs/locale/es';

const InputDateTime = ({ date, handleChange, format = 'YYYY/MM/DD HH:mm', label, name, required }) => {
  return (
    <div className="col-sm-12 d-flex align-items-center mb-3">
      <label htmlFor={name} className="form-label me-2" style={{width: "200px", color: "var(--blue)"}}>
        {label} {required && <span className="-required">*</span>}
      </label>
      <div className="input-box">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'es'}>
          <DateTimePicker
            value={date}
            format="DD/MM/YYYY HH:mm"
            onChange={(newValue) => handleChange(newValue)}
            slotProps={{ 
              textField: {
                id: name,
                required: required,
              },
              calendarHeader: { format: 'MM/YYYY' }
            }}
            ampm={false}
            className="form-control flex-grow-1 ms-3"
            sx={{ width: "100%" }}
            name={name}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default InputDateTime;