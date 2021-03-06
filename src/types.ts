export interface data {
    gameId: number
    gameDuraton: number
    blueWins: boolean
    blueFirstBlood: boolean
    blueFirstTower: boolean
    blueFirstBaron: boolean
    blueFirstDragon: boolean
    blueFirstInhibitor: boolean
    blueDragonKills: number
    blueBaronKills: number
    blueTowerKills: number
    blueInhibitorKills: number
    blueWardPlaced: number
    blueWardkills: number
    blueKills: number
    blueDeath: number
    blueAssist: number
    blueChampionDamageDealt: number
    blueTotalGold: number
    blueTotalMinionKills: number
    blueTotalLevel: number
    blueAvgLeve: number
    blueJungleMinionKills: number
    blueKillingSpree: number
    blueTotalHeal: number
    blueObjectDamageDealt: number
    redWins: boolean
    redFirstBlood: boolean
    redFirstTower: boolean
    redFirstBaron: boolean
    redFirstDragon: boolean
    redFirstInhibitor: boolean
    redDragonKills: number
    redBaronKills: number
    redTowerKills: number
    redInhibitorKills: number
    redWardPlaced: number
    redWardkills: number
    redKills: number
    redDeath: number
    redAssist: number
    redChampionDamageDealt: number
    redTotalGold: number
    redTotalMinionKills: number
    redTotalLevel: number
    redAvgLevel: number
    redJungleMinionKills: number
    redKillingSpree: number
    redTotalHeal: number
    redObjectDamageDealt: number
}
export interface Correlations {
    [key: string]: number
}
export interface Attribute {
    name: string
    value: number
}

export interface Size {
    width: number
    height: number
    margin: number
}
