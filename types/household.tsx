export interface Household {
    id: string;
    name: string;
    avatar_url: string;
}

export interface HouseholdMember {
    id: string;
    name: string;
    email: string;
    is_owner: boolean;
}