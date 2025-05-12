import DaumPostcodeEmbed from "react-daum-postcode";
import { useLayout } from "../../../hooks/useLayout.ts";

const AddressSearchPopup = () => {
  useLayout({
    headerVisible: false,
    bottomNavVisible: false,
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
      <h2 className="text-lg font-bold mb-2">주소 검색</h2>
      <DaumPostcodeEmbed onComplete={handleComplete} />
    </div>
  );
};

export default AddressSearchPopup;
