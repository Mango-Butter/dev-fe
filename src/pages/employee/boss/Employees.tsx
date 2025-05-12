import Button from "../../../components/common/Button.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import RegularScheduleAddForm from "./RegularScheduleAddForm.tsx";

interface Staff {
  staffId: number;
  name: string;
  phone: string;
  role: "STAFF" | "BOSS";
  profileImageUrl: string;
}

const dummyStaffList: Staff[] = [
  {
    staffId: 1,
    name: "알바생 1",
    phone: "010-1234-5678",
    role: "STAFF",
    profileImageUrl: "https://i.pravatar.cc/48?img=1",
  },
  {
    staffId: 2,
    name: "알바생 2",
    phone: "010-2345-6789",
    role: "STAFF",
    profileImageUrl: "https://i.pravatar.cc/48?img=2",
  },
  {
    staffId: 3,
    name: "알바생 3",
    phone: "010-3456-7890",
    role: "STAFF",
    profileImageUrl: "https://i.pravatar.cc/48?img=3",
  },
  {
    staffId: 4,
    name: "알바생 4",
    phone: "010-4567-8901",
    role: "STAFF",
    profileImageUrl: "https://i.pravatar.cc/48?img=4",
  },
  {
    staffId: 5,
    name: "알바생 5",
    phone: "010-5678-9012",
    role: "STAFF",
    profileImageUrl: "https://i.pravatar.cc/48?img=5",
  },
];

const Employees = () => {
  const { setBottomSheetContent } = useBottomSheetStore();

  const openAddRegularScheduleSheet = (staff: Staff) => {
    setBottomSheetContent(<RegularScheduleAddForm />, {
      title: `${staff.name} 고정 스케줄 추가`,
      closeOnClickOutside: true,
    });
  };

  return (
    <div className="flex w-full h-full flex-col gap-6 px-4 py-8">
      <h1 className="text-xl font-semibold text-center">
        직원별 고정 스케줄 추가
      </h1>
      {dummyStaffList.map((staff) => (
        <div
          key={staff.staffId}
          className="flex items-center justify-between border rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <img
              src={staff.profileImageUrl}
              alt={`${staff.name} 프로필`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-base font-medium">{staff.name}</p>
              <p className="text-sm text-gray-500">{staff.phone}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => openAddRegularScheduleSheet(staff)}
            theme="outline"
            state="default"
          >
            고정 근무 추가
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Employees;
