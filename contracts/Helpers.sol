//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.9;
import "./Types.sol";

contract Helpers {
    function arrayFindAddressIndex(address addr, address[] memory arr)
        internal
        pure
        returns (bool found, uint256 index)
    {
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
}
