pragma solidity ^0.5.15;

contract Voting {

    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    uint public countCandidates;
    uint public votingStart;
    uint public votingEnd;

    constructor() public {
        countCandidates = 0;
    }

    function addCandidate(string memory _name, string memory _party) public {
        countCandidates++;
        candidates[countCandidates] = Candidate(
            countCandidates,
            _name,
            _party,
            0
        );
    }

    function vote(uint _candidateID) public {
        require(!voters[msg.sender], "Already voted");
        require(_candidateID > 0 && _candidateID <= countCandidates, "Invalid candidate");
        require(now >= votingStart && now <= votingEnd, "Voting closed");

        voters[msg.sender] = true;
        candidates[_candidateID].voteCount++;
    }

    function checkVote() public view returns (bool) {
        return voters[msg.sender];
    }

    function getCandidate(uint _candidateID)
        public
        view
        returns (uint, string memory, string memory, uint)
    {
        Candidate memory c = candidates[_candidateID];
        return (c.id, c.name, c.party, c.voteCount);
    }

    function setDates(uint _start, uint _end) public {
        require(votingStart == 0 && votingEnd == 0, "Dates already set");
        require(_end > _start, "Invalid dates");
        votingStart = _start;
        votingEnd = _end;
    }

    function getDates() public view returns (uint, uint) {
        return (votingStart, votingEnd);
    }
}
