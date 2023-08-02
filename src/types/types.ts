type Concept = {
  concept_id: string;
  label: string;
  legacy_ams_taxonomy_id: string;
};

type WeightedConcept = Concept & {
  weight: number;
};

type Description = {
  text: string;
  text_formatted: string;
  company_information: string;
  needs: string;
  requirements: string;
  conditions: string;
};

type ScopeOfWork = {
  min: number;
  max: number;
};

type Employer = {
  phone_number: string;
  email: string;
  url: string;
  organization_number: string;
  name: string;
  workplace: string;
};

type ApplicationDetails = {
  information: string;
  reference: string;
  email: string;
  via_af: boolean;
  url: string;
  other: string;
};

type WorkplaceAddress = {
  municipality: string;
  municipality_code: string;
  municipality_concept_id: string;
  region: string;
  region_code: string;
  region_concept_id: string;
  country: string;
  country_code: string;
  country_concept_id: string;
  street_address: string;
  postcode: string;
  city: string;
  coordinates: number[];
};

type MustHave = {
  skills: WeightedConcept[];
  languages: WeightedConcept[];
  work_experiences: WeightedConcept[];
  education: WeightedConcept[];
  education_level: WeightedConcept[];
};

type ApplicationContacts = {
  name: string;
  description: string;
  email: string;
  telephone: string;
  contact_type: string;
};

export type Job = {
  id: string;
  external_id: string;
  original_id: string;
  webpage_url: NonNullable<unknown>;
  logo_url: string;
  headline: string;
  application_deadline: string;
  number_of_vacancies: number;
  description: Description;
  employment_type: Concept;
  salary_type: Concept;
  salary_description: string;
  duration: Concept;
  working_hours_type: Concept;
  scope_of_work: ScopeOfWork;
  access: string;
  employer: Employer;
  application_details: ApplicationDetails;
  experience_required: boolean;
  access_to_own_car: boolean;
  driving_license_required: boolean;
  driving_license: Concept[];
  occupation: Concept;
  occupation_group: Concept;
  occupation_field: Concept;
  workplace_address: WorkplaceAddress;
  must_have: MustHave;
  nice_to_have: MustHave;
  application_contacts: ApplicationContacts;
  publication_date: string;
  last_publication_date: string;
  removed: boolean;
  removed_date: string;
  source_type: string;
  timestamp: number;
  relevance: number;
};

type Total = {
  value: number;
};

type StatsValue = {
  term: string;
  concept_id: string;
  code: string;
  count: number;
};

type Stats = {
  type: string;
  values: StatsValue[];
};

type FreetextConcepts = {
  skill: string[];
  occupation: string[];
  location: string[];
  skill_must: string[];
  occupation_must: string[];
  location_must: string[];
  skill_must_not: string[];
  occupation_must_not: string[];
  location_must_not: string[];
};

export type SearchResult = {
  total: Total;
  positions: number;
  query_time_in_millis: number;
  result_time_in_millis: number;
  stats: Stats[];
  freetext_concepts: FreetextConcepts;
  hits: Job[];
};