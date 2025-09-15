export interface Household {
    id: string;
    name: string;
    avatar_url: string;
    is_owner: boolean;
}

export interface HouseholdMember {
    id: string;
    name: string;
    email: string;
    is_owner: boolean;
}

export const EmptyHouseholdMember: HouseholdMember = {
    id: '',
    name: '',
    email: '',
    is_owner: false
};