// teamNameMap.js

const nameFixMap = {
    "76ers": "Sixers",
  };
  
  // 2. Helper to fix a team name if needed
  function fixTeamName(teamName) {
    // if the name exists in nameFixMap, return the fixed version; otherwise, the original
    return nameFixMap[teamName] || teamName;
  }
  

const teamNameMap = {
    Hawks: 'atlanta-hawks',
    Celtics: 'boston-celtics',
    Nets: 'brooklyn-nets',
    Hornets: 'charlotte-hornets',
    Bulls: 'chicago-bulls',
    Cavaliers: 'cleveland-cavaliers',
    Mavericks: 'dallas-mavericks',
    Nuggets: 'denver-nuggets',
    Pistons: 'detroit-pistons',
    Warriors: 'golden-state-warriors',
    Rockets: 'houston-rockets',
    Pacers: 'indiana-pacers',
    Clippers: 'los-angeles-clippers', // note: file is "los-angeles-clippers.png" (missing -logo)
    Lakers: 'los-angeles-lakers',
    Grizzlies: 'memphis-grizzlies',
    Heat: 'miami-heat',
    Bucks: 'milwaukee-bucks',
    Timberwolves: 'minnesota-timberwolves',
    Pelicans: 'new-orleans-pelicans',
    Knicks: 'new-york-knicks',
    Thunder: 'oklahoma-city-thunder',
    Magic: 'orlando-magic',
    Sixers: 'philadelphia-76ers',
    Suns: 'phoenix-suns',
    Blazers: 'portland-trail-blazers',
    Kings: 'sacramento-kings',
    Spurs: 'san-antonio-spurs',
    Raptors: 'toronto-raptors',
    Jazz: 'utah-jazz',
    Wizards: 'washington-wizards',
  };
  
  function getTeamSlug(teamName) {
    const fixedName = fixTeamName(teamName);
  
    // Look up the slug
    const slug = teamNameMap[fixedName];
    // Return it or null/undefined if not found
    return slug;
  }
  
  // Optionally, export both the main function and any other helper you need
  export {
    getTeamSlug, // to get the slug
    fixTeamName, // optional if you want direct access
  };
  