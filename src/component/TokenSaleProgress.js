import { useSelector } from "react-redux";
import { formattedNumber } from "../utils";

//this component is used for progress bar
export const TokenSaleProgress = () => {
  const MAX = 25000000;
  const {  sales } = useSelector((state) => state?.currenyReducer);
  const balanceMid =  sales && sales?.user_purchase_token ? sales?.user_purchase_token  : 0;
  const getBackgroundSize = () => {
    return {
      backgroundSize: `${(balanceMid * 100) / MAX}% 100%`,
      zIndex: `${balanceMid > 88 ? 1 : 0}`,
    };
  };

  return (
    <div className="input-slider">
      <div className="input-top-label">
        <div>
          <label>Raised</label>
          <div className="label-amount">{formattedNumber(balanceMid)} MID</div>
        </div>
        <div className="text-end">
          <label>Total</label>
          <div className="label-amount">{MAX} MID</div>
        </div>
      </div>
      <div className="input-range">
        <div className="range-start"></div>
        <input
          type="range"
          min="0"
          max={MAX}
          value={balanceMid}
          style={getBackgroundSize()}
          disabled
        />
        <div className="range-end"></div>
      </div>
      <div className="soft-cap">
        <div className="soft-cap-left">
          Soft cap
          <br />10M
        </div>
        <div className="soft-cap-right">
          Hard cap
          <br />15M
        </div>
      </div>
    </div>
  );
};

export default TokenSaleProgress;
