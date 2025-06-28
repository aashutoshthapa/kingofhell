import React from 'react';
import { Trophy, Target, Ticket } from 'lucide-react';
import { calculateTrophyTickets, calculateDonationTickets, calculateClanGamesTickets, calculateRaidTickets } from '../utils/statsCalculator';

interface Member {
  id: string;
  player_name: string;
  player_tag: string;
  discord_handle?: string;
  current_trophies: number;
  total_trophies: number;
  current_donations: number;
  current_capital_gold?: number;
  current_clan_games?: number;
  total_donations: number;
  clan_games_points: number;
  total_clan_games: number;
  perfect_wars: number;
  wars_missed: number;
  perfect_month: number;
  cwl_performance: number;
  trophy_tickets: number;
  donation_tickets: number;
  clan_games_tickets: number;
  raid_tickets: number;
  total_tickets: number;
  created_at: string;
  updated_at: string;
}

interface MembersTableProps {
  members: Member[];
  darkMode?: boolean;
}

export default function MembersTable({ members, darkMode = false }: MembersTableProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getTrophyTicketColor = (tickets: number) => {
    if (tickets >= 12) return darkMode ? 'text-green-400' : 'text-green-600';
    if (tickets >= 8) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (tickets >= 5) return darkMode ? 'text-orange-400' : 'text-orange-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getDonationTicketColor = (tickets: number) => {
    if (tickets >= 3) return darkMode ? 'text-green-400' : 'text-green-600';
    if (tickets >= 2) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (tickets >= 1) return darkMode ? 'text-orange-400' : 'text-orange-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getClanGamesTicketColor = (tickets: number) => {
    if (tickets >= 5) return darkMode ? 'text-green-400' : 'text-green-600';
    if (tickets >= 3) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (tickets >= 1) return darkMode ? 'text-orange-400' : 'text-orange-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getRaidTicketColor = (tickets: number) => {
    if (tickets >= 5) return darkMode ? 'text-green-400' : 'text-green-600';
    if (tickets >= 3) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (tickets >= 1) return darkMode ? 'text-orange-400' : 'text-orange-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getTicketColor = (tickets: number) => {
    if (tickets >= 3) return darkMode ? 'text-green-400' : 'text-green-600';
    if (tickets >= 2) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (tickets >= 1) return darkMode ? 'text-orange-400' : 'text-orange-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  if (members.length === 0) {
    return (
      <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <Trophy className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No clan members found</p>
        <p className="text-sm">Sync clan data to see members listed here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Player Name
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Player Tag
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Discord
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Trophy
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              T.Trophy
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Donation
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              T.Donation
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Clan Games
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              T.ClanGames
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Capital Gold Looted
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              T.CG
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Perfect War
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              No War Miss
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Perfect Whole Month
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              CWL
            </th>
            <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Total Points
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
          {members.map((member) => {
            // Use ticket values from database (from Google Sheets GHIJ columns)
            const trophyTickets = member.trophy_tickets || calculateTrophyTickets(member.current_trophies);
            const donationTickets = member.donation_tickets || calculateDonationTickets(member.current_donations);
            const clanGamesTickets = member.clan_games_tickets || calculateClanGamesTickets(member.current_clan_games || member.clan_games_points);
            const raidTickets = member.raid_tickets || calculateRaidTickets(member.current_capital_gold || 0);
            
            // Use GHIJ values as direct ticket values (from Google Sheets)
            const perfectWarTickets = member.perfect_wars || 0; // Column G
            const noWarMissTickets = member.wars_missed || 0; // Column H  
            const perfectMonthTickets = member.perfect_month || 0; // Column I - handle both old and new format
            const cwlTickets = member.cwl_performance || 0; // Column J - handle both old and new format
            
            const totalTickets = trophyTickets + donationTickets + clanGamesTickets + raidTickets + 
                               perfectWarTickets + noWarMissTickets + perfectMonthTickets + cwlTickets;
            
            return (
              <tr key={member.id} className={`hover:${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}>
                {/* Player Name - API Data */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {member.player_name}
                </td>
                
                {/* Player Tag - API Data */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {member.player_tag}
                </td>
                
                {/* Discord - Manual Data */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {member.discord_handle || '-'}
                </td>
                
                {/* Trophy - API Data */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {formatNumber(member.current_trophies)}
                  </div>
                </td>
                
                {/* T.Trophy - Calculated Trophy Tickets */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getTrophyTicketColor(trophyTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{trophyTickets}</span>
                  </div>
                </td>
                
                {/* Donation - API Data (Monthly) */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <div className="flex items-center gap-1">
                    <img 
                      src="/images/donation.png" 
                      alt="Donation" 
                      className="h-4 w-4" 
                    />
                    {formatNumber(member.current_donations)}
                  </div>
                </td>
                
                {/* T.Donation - Calculated Donation Tickets */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getDonationTicketColor(donationTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{donationTickets}</span>
                  </div>
                </td>
                
                {/* Clan Games - API Data (Monthly) or Manual */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  <div className="flex items-center gap-1">
                    <img 
                      src="/images/clan-games.png" 
                      alt="Clan Games" 
                      className="h-4 w-4" 
                    />
                    {formatNumber(member.current_clan_games || member.clan_games_points)}
                  </div>
                </td>
                
                {/* T.ClanGames - Calculated Clan Games Tickets */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getClanGamesTicketColor(clanGamesTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{clanGamesTickets}</span>
                  </div>
                </td>
                
                {/* Capital Gold Looted - API Data (Monthly) */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                  <div className="flex items-center gap-1">
                    <img 
                      src="/images/capital-gold.png" 
                      alt="Capital Gold" 
                      className="h-4 w-4" 
                    />
                    {formatNumber(member.current_capital_gold || 0)}
                  </div>
                </td>
                
                {/* T.CG - Calculated Raid Tickets */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getRaidTicketColor(raidTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{raidTickets}</span>
                  </div>
                </td>
                
                {/* Perfect War - Manual Data (2 tickets each) */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getTicketColor(perfectWarTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{perfectWarTickets}</span>
                  </div>
                </td>
                
                {/* No War Miss - Manual Data (2 tickets if 0 missed) */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getTicketColor(noWarMissTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{noWarMissTickets}</span>
                  </div>
                </td>
                
                {/* Perfect Whole Month - Manual Data (5 tickets if true) */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getTicketColor(perfectMonthTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{perfectMonthTickets}</span>
                  </div>
                </td>
                
                {/* CWL - Manual Data (tickets based on performance) */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${getTicketColor(cwlTickets)}`}>
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-bold">{cwlTickets}</span>
                  </div>
                </td>
                
                {/* Total Points - Calculated */}
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {formatNumber(totalTickets)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}