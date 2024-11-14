using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace ticTacToeSignalR
{
    public class GameHub: Hub
    {
        private readonly static ConcurrentDictionary<string, int> _groupIdGame = new();  
        private static Dictionary<string, int> _groupClientCount = new();

        public async Task CreateMatchList()
        {
            string gameId = Guid.NewGuid().ToString();

            _groupIdGame.TryAdd(gameId, -1);
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            await Clients.Caller.SendAsync("MatchListCreated", gameId);
            _groupClientCount.Add(gameId, 1);
            Console.WriteLine($"Grupo: {gameId} --> total: {_groupClientCount[gameId]}");
        }

        public async Task JoinMatchList(string matchListId)
        {
            if(_groupIdGame.TryGetValue(matchListId, out var list) && _groupClientCount[matchListId] == 1)
            {

                await Groups.AddToGroupAsync(Context.ConnectionId, matchListId);
                
                // var groupClients = _groupClientCount.Select(g => g.Key == matchListId ? g.Value + 1 : g.Value);

                ++_groupClientCount[matchListId];
                
                System.Console.WriteLine("-----------");
                foreach (var item in _groupClientCount)
                {
                    Console.WriteLine($"Client Joined! \nGrupo: {item.Key} --> total: {item.Value}");
                }

                await Clients.Group(matchListId).SendAsync("JoinMatchList", matchListId, list);
            }
        }

        public async Task SendMatchValues(string matchListId, int value)
        {
            if(_groupIdGame.TryGetValue(matchListId, out _))
            {
                await Clients.Group(matchListId).SendAsync("ReceiveMatchValues", value);
            }
        }

        public async Task<bool> GetIsMultiplayer(string matchListId)
        {
            if(_groupClientCount.ContainsKey(matchListId))
            {
                Console.Write("Resultado ---> {0}", _groupClientCount[matchListId]);
                return await Task.FromResult(_groupClientCount[matchListId] == 2);
            }
            
            return await Task.FromResult(false);
        }
    }
}