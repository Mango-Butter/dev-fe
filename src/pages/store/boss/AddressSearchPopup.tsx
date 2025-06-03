import DaumPostcodeEmbed from "react-daum-postcode";
import { useLayout } from "../../../hooks/useLayout.ts";

const AddressSearchPopup = () => {
  useLayout({
    title: "주소 검색",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => window.close(),
    rightIcon: null,
  });

  const handleComplete = (data: any) => {
    const fullAddress = data.address;
    if (window.opener) {
      window.opener.postMessage(
        { address: fullAddress },
        window.location.origin,
      );
      window.close();
    }
  };

  return (
    <div className="h-full p-4">
      <DaumPostcodeEmbed onComplete={handleComplete} />
    </div>
  );
};

export default AddressSearchPopup;
