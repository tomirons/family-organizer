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
});