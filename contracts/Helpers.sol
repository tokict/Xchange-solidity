//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;
import "./Types.sol";
import "../node_modules/hardhat/console.sol";

contract Helpers {
    function arrayFindAddressIndex(
        address payable addr,
        address payable[] memory arr
    ) internal pure returns (bool found, uint256 index) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == addr) {
                return (true, i);
            }
        }

        return (false, 0);
    }

    function arrayFindResourceIndex(uint16 id, Resource[] memory arr)
        internal
        pure
        returns (bool found, uint256 index)
    {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return (true, i);
            }
        }

        return (false, 0);
    }

    function arrayFindBidIndex(uint16 id, ResourceBid[] memory arr)
        internal
        pure
        returns (bool found, uint16 index)
    {
        for (uint16 i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return (true, i);
            }
        }

        return (false, 0);
    }

    function arrayFindAskIndex(uint16 id, ResourceAsk[] memory arr)
        internal
        pure
        returns (bool found, uint16 index)
    {
        for (uint16 i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return (true, i);
            }
        }

        return (false, 0);
    }

    function calculatePercentage(uint256 theNumber, uint16 percentage)
        public
        pure
        returns (uint256)
    {
        return (theNumber * percentage) / 10000;
    }

    function createCalculationKey(uint16 resourceId, uint16 periodId)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(periodId, "_", resourceId));
    }

    function createAddressKey(uint16 periodId, address addr)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(periodId, "_", addr));
    }
}
