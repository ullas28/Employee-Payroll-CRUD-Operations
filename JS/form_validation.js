var isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (event) => {
  const name = document.querySelector('#name');
  const nameError = document.querySelector('.text-error');
  name.addEventListener('input', function () {
    if (name.value.length == 0) {
      nameError.textContent = "";
      return;
    }
    try {
      (new EmployeePayrollData()).name = name.value;
      nameError.textContent = "";
    }catch (e) {
      nameError.textContent = e;
    }
  });

//   const date = document.querySelector('#date');
// date.addEventListener('input', function() {
//    const startDate = Date.parse(getInputValueById('#day') + " " +
//                                                 getInputValueById('#month') + " " +
//                                                 getInputValueById('#year'));
//    try {
//       (new EmployeePayrollData()).start_date = startDate;
//       setTextValue('.date-error', "");
//    } catch (e) {
//       setTextValue('.date-error', e);
// }
// });

  const salary = document.querySelector('#salary');
  const output = document.querySelector('.salary-output');
  output.textContent = salary.value;
  salary.addEventListener('input', function () {
    output.textContent = salary.value;
  });
  
// checkForUpdate();
});

const save = (event) => {
  event.preventDefault();
  event.stopPropagation();
  try {
     setEmployeePayrollObject();
     createAndUpdateStorage();
     resetForm();
     window.location.replace(site - properties.home_page);
  } catch (e) {
     return;
  }
};

const setEmployeePayrollObject = () => {
  employeePayrollObj._name = getInputValueById('#name');
  employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
  employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
  employeePayrollObj._department = getSelectedValues('[name=department]');
  employeePayrollObj._salary = getInputValueById('#salary');
  employeePayrollObj._note = getInputValueById('#notes');
  let date = getInputValueById('#day') + " " + getInputValueById('#month') + " "
     + getInputValueById('#year');
  employeePayrollData._start_date = date;
}

const getSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  let selItems = [];
  allItems.forEach(item => {
     if (item.checked)
        selItems.push(item.value);
  });
  return selItems;
}

const getInputValueById = (id) => {
  let value = document.querySelector(id).value;
  return value;
}

const createAndUpdateStorage = () => {
  // localStorage.clear();
  let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
  if (employeePayrollList) {
     let empPayrollData = employeePayrollList
        .find(empData => empData._id == employeePayrollObj._id);
     if (!empPayrollData) {
        employeePayrollList.push(createEmployeePayrollData());
     } else {
        const index = employeePayrollList
           .map(empData => empData._id)
           .indexOf(employeePayrollData._id);
        employeePayrollList.splice(index, 1,
           createEmployeePayrollData(empPayrollData._id));
     }
  } else {
     employeePayrollList = [createEmployeePayrollData()];
  }
  localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmployeePayrollData = (id) => {
  let employeePayrollData = new EmployeePayrollData();
  if (!id) employeePayrollData.id = createNewEmployeeId();
  else employeePayrollData.id = id;
  setEmployeePayrollData(employeePayrollData);
  return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {
  try {
     employeePayrollData.name = employeePayrollObj._name;
  } catch (e) {
     setTextValue('.text-error', e);
     throw e;
  }

  employeePayrollData._profilePic = employeePayrollObj._profilePic;
  employeePayrollData.gender = employeePayrollObj._gender;
  employeePayrollData.department = employeePayrollObj._department;
  employeePayrollData.salary = employeePayrollObj._salary;
  employeePayrollData.note = employeePayrollObj._salary;
  try { 
     employeePayrollData.startDate =
        new Date(Date.parse(employeePayrollObj._startdate));
  } catch (e) {
     setTextValue('.date-error', e);
     throw e;
  }
  alert(employeePayrollData.toString());
}

const createNewEmployeeId = () => {
  let empID = localStorage.getItem("EmployeeID");
  empID = !empID ? 1 : (parseInt(empID) + 1).toString();
  localStorage.setItem("EmployeeID", empID);
  return empID;
}


const resetForm = () => {
  setValue('#name', '');
  unsetSelectedValues('[name=profile]');
  unsetSelectedValues('[name=gender]');
  unsetSelectedValues('[name=department]');
  setValue('#salary', '');
  setValue('#notes', '');
  setValue('#day', 'Day');
  setValue('#month', 'Month');
  setValue('#year', 'Year');
};

const unsetSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach(item => {
     item.checked = false;
  });
}

const setTextValue = (id, value) => {
  const element = document.querySelector(id);
  element.textContent = value;
}

const setValue = (id, value) => {
  const element = document.querySelector(id);
  element.value = value;
}

const checkForUpdate = () => {
  const employeePayrollJson = localStorage.getItem('editEmp');
  isUpdate = employeePayrollJson ? true : false;
  if (!isUpdate)
     return;
  employeePayrollObj = JSON.parse(employeePayrollJson);
  setForm();
};

const setForm = () => {
  setValue('#name', employeePayrollObj._name);
  setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
  setSelectedValues("[name=gender]", employeePayrollObj._gender);
  setSelectedValues("[name=department]", employeePayrollObj._department);
  setValue("#salary", employeePayrollObj._salary);
  setTextValue(".salary-output", employeePayrollObj._salary);
  setValue("#notes", employeePayrollObj._note);
  let date = stringifyDate(employeePayrollObj._start_date).split(" ");
  setValue("#day", date[0]);
  setValue("#month", date[1]);
  setValue("#year", date[2]);
};

const setSelectedValues = (propertyValue, value) => {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach((item) => {
     if (Array.isArray(value)) {
        if (value.includes(item.value)) {
           item.checked = true;
        }
     }
     else if (item.value === value)
        item.checked = true;
  });
};