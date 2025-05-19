export interface WorkSchedule {
  dayOfWeek: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface ContractTemplateData {
  contractStart: string | null;
  contractEnd: string | null;
  duty: string | null;
  hourlyWage: number | null;
  workSchedules: WorkSchedule[] | null;
}

export interface CreateContractTemplateRequest {
  title: string;
  contractTemplateData: ContractTemplateData;
}

export interface UpdateContractTemplateResponse {
  title: string;
  contractTemplateData: ContractTemplateData;
}

export interface ContractTemplateSummary {
  templateId: number;
  title: string;
}

export interface FetchContractTemplateListResponse {
  result: ContractTemplateSummary[];
}

export interface FetchContractTemplateDetailResponse {
  title: string;
  contractTemplateData: ContractTemplateData;
}
