// Financial calculation utilities

export interface ExpenseParams {
  baseSalary: number
  benefitsRate: number
  overheadRate: number
  profitMargin: number
}

export const calculateExpenses = (fte: number, year: number, expenseParams: ExpenseParams) => {
  const { baseSalary, benefitsRate, overheadRate, profitMargin } = expenseParams
  
  // Calculate base expenses
  const salaryExpense = baseSalary * fte
  const benefitsExpense = salaryExpense * (benefitsRate / 100)
  const overheadExpense = (salaryExpense + benefitsExpense) * (overheadRate / 100)
  
  // Calculate total expenses
  const totalExpenses = salaryExpense + benefitsExpense + overheadExpense
  
  // Apply year-over-year growth (assuming 3% annual growth)
  const growthFactor = Math.pow(1.03, year - 1)
  
  return {
    salary: salaryExpense * growthFactor,
    benefits: benefitsExpense * growthFactor,
    overhead: overheadExpense * growthFactor,
    total: totalExpenses * growthFactor
  }
}

export const calculateRevenue = (year: number, projects: any[], expenseParams: ExpenseParams) => {
  // Calculate total project value for the year
  const yearProjects = projects.filter((project: any) => {
    const projectDate = new Date(project.Date || project.date || Date.now())
    return projectDate.getFullYear() === year
  })
  
  const totalProjectValue = yearProjects.reduce((sum: number, project: any) => {
    return sum + (project.Fee || project.fee || 0)
  }, 0)
  
  // Calculate required revenue based on expenses and profit margin
  const fte = getFTE(year, projects)
  const expenses = calculateExpenses(fte, year, expenseParams)
  const requiredRevenue = expenses.total / (1 - (expenseParams.profitMargin / 100))
  
  return {
    projectRevenue: totalProjectValue,
    requiredRevenue: requiredRevenue,
    gap: requiredRevenue - totalProjectValue
  }
}

export const getFTE = (year: number, projects: any[]) => {
  // Calculate FTE based on project workload
  const yearProjects = projects.filter((project: any) => {
    const projectDate = new Date(project.Date || project.date || Date.now())
    return projectDate.getFullYear() === year
  })
  
  // Simple FTE calculation based on project count and complexity
  const totalProjectValue = yearProjects.reduce((sum: number, project: any) => {
    return sum + (project.Fee || project.fee || 0)
  }, 0)
  
  // Assume each FTE can handle $500K worth of projects per year
  const ftePerMillion = 2
  const estimatedFTE = (totalProjectValue / 1000000) * ftePerMillion
  
  // Ensure minimum of 1 FTE
  return Math.max(1, Math.round(estimatedFTE * 10) / 10)
}

export const updateExpenseParam = (
  currentParams: ExpenseParams, 
  key: keyof ExpenseParams, 
  value: number
): ExpenseParams => {
  return {
    ...currentParams,
    [key]: value
  }
}

export const defaultExpenseParams = {
  avgSalary: 150000,
  healthcarePerEmployee: 18000,
  payrollTaxRate: 0.0765,
  unemploymentTaxRate: 0.006,
  workersCompRate: 0.005,
  retirement401kRate: 0.06,
  officeRentPerMonth: 2500,
  utilitiesPerMonth: 400,
  internetPhonePerMonth: 300,
  laptopPerEmployee: 2500,
  softwareLicensesPerEmployee: 2400,
  itSupportPerEmployee: 1200,
  freelanceAnnual: 50000,
  accountingAnnual: 15000,
  legalAnnual: 8000,
  insuranceAnnual: 12000,
  marketingAnnual: 25000,
  conferencesTrainingPerEmployee: 5000,
  travelPerEmployee: 15000,
  officeSuppliesPerEmployee: 1500,
  miscellaneousPerEmployee: 2000,
  inflationRate: 0.03,
  loanAmount: 0,
  loanInterestRate: 0.06,
  loanTermYears: 5,
} 