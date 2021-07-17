# A D3 visualization of the results of the Democratic primary for the NYC mayoral race

In June 2021, the citizens of New York headed to the polls to vote in the mayoral primaries, but this time the polls looked a little different. For the first time, the city used ranked-choice voting, which meant that instead of voting for just candidate, voters could rank their top 5 choices in order of preference. For this project, I used Python to scrape election results from the Board of Elections website and then created a D3 data visualization to show how the process of ranked-choice voting played out in the Democratic primary election. 

# How ranked-choice voting works

For voters, the process is straightforward. Put your favorite candidate as your first choice, your second-favorite as your second choice, etc. You do not have to list five choices if there are fewer than five candidates that you like. 

How to find out who won the election: 
1) Look at every voter's 1st choice on their ballots.
2) If no candidate has a majority, then the candidate with the least votes is eliminated. (Multiple candidates may be eliminated at one time if all of their votes combined are less than the next-ranked candidate.)
3) If a voter's chosen candidate is eliminated, their vote goes to the next choice on their ballot. 
4) Continue to eliminate candidates and redistribute votes until one candidate has a majority.

In the New York Democratic primary race, it took eight rounds of elimination before Eric Adams was declared the winner.

# Acknowledgements 

Thank you to Gurman Bhatia, Jonathan Soma, and Suhail Bhat-ta for their help.
The D3 code was based on a block by Joel Zief (https://bl.ocks.org/jrzief/70f1f8a5d066a286da3a1e699823470f) which in turn is probably based on code by Mike Bostock (https://observablehq.com/@d3/bar-chart-race).
 
