// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./Crowdsale.sol";
import "./KYC.sol";

contract ZTTokenSale is Crowdsale {

    KYC _kyc;

    constructor(uint256 rate, address payable wallet, IERC20 token, KYC kyc) Crowdsale(rate, wallet, token) {
        _kyc = kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(_kyc.getKYCCompleted(beneficiary), "KYC not completed yet, aborting");
    }   
}