// src/mocks/payrollMock.ts

import {
  PayrollSettingsResponse,
  StaffPayroll,
} from "../../../types/payroll.ts";

export const dummyStaffPayrolls: StaffPayroll[] = [
  {
    staff: {
      staffId: 1,
      name: "망알바",
      profileImageUrl:
        "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800",
    },
    payroll: {
      key: "payroll:1:2025-05",
      bankCode: "농협은행",
      account: "3020000012816",
      month: "2025-05-01",
      withholdingType: "공제없음",
      totalTime: 42,
      baseAmount: 420000,
      weeklyAllowance: 30000,
      totalAmount: 450000,
      withholdingTax: 2000,
      netAmount: 448000,
    },
  },
  {
    staff: {
      staffId: 2,
      name: "고알바",
      profileImageUrl:
        "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800",
    },
    payroll: {
      key: "payroll:2:2025-05",
      bankCode: "신한은행",
      account: "110123456789",
      month: "2025-05-01",
      withholdingType: "3.3% 원천징수",
      totalTime: 55,
      baseAmount: 550000,
      weeklyAllowance: 40000,
      totalAmount: 590000,
      withholdingTax: 19470,
      netAmount: 570530,
    },
  },
  {
    staff: {
      staffId: 3,
      name: "심알바",
      profileImageUrl:
        "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800",
    },
    payroll: {
      key: "payroll:3:2025-05",
      bankCode: "카카오뱅크",
      account: "3333123456789",
      month: "2025-05-01",
      withholdingType: "공제없음",
      totalTime: 30,
      baseAmount: 300000,
      weeklyAllowance: 20000,
      totalAmount: 320000,
      withholdingTax: 0,
      netAmount: 320000,
    },
  },
];

export const dummyPayrollSettings: PayrollSettingsResponse = {
  account: {
    bankName: "농협은행",
    accountNumber: "3020000012814",
    accountHolder: "망고보스",
  },
  autoTransferEnabled: true,
  transferDate: 7,
  overtimeLimit: 5,
  deductionUnit: "TEN_MIN",
};
