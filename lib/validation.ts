import * as Yup from 'yup';

export const createHouseholdSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    timezone: Yup.string().required().label('Timezone'),
});

export const updateHouseholdSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    timezone: Yup.string().required().label('Timezone'),
});

export const createHouseholdMemberSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    email: Yup.string().email().nullable().label('Email'),
    is_owner: Yup.boolean().label('Is Owner'),
});

export const createMealSchema = Yup.object().shape({
    date: Yup.date().required().label('Date'),
    type_id: Yup.string().required().label('Type'),
    name: Yup.string().required().label('Name'),
    notes: Yup.string().nullable().label('Notes'),
});

export const createMealTypeSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    time: Yup.string().required().label('Time'),
    color: Yup.string().required().label('Color'),
});

export const createTaskSchema = Yup.object().shape({
    title: Yup.string().required().label('Title'),
    assignee_id: Yup.string().nullable().label('Assignee'),
    notes: Yup.string().nullable().label('Notes'),
});