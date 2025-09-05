import * as Yup from 'yup';

export const createHouseholdSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
});

export const updateHouseholdSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
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