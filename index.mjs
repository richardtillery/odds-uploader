console.log('Loading function');
import { createClient } from 'redis';

export const handler = async (event, context) => {

    console.log('Received event:', JSON.stringify(event, null, 2));
    let key = event.teamA + 'v' + event.teamB + '-' + event.teamA + '-' + event.date;
    console.log('key = [%s] and value(line) = [%s]', key, event.line);

    var client = createClient(
        {
        url:  `redis://localhost:6379`,
        socket: {
            reconnectStrategy: false
        }
        //url:  `redis://current-lines-ferywn.serverless.use1.cache.amazonaws.com:6379`
      }
    );
    client.on('error', error => {
        console.error(`Redis client error: `, error);
    });

    await client.connect();
    const notInCache = await keyNotPresentInCache(key, client);
    
    if( notInCache ) {
        const [setKeyReply, fetchedValue] = await client
        .multi()
        .hSet(key, {
            team: event.teamA,
            line: event.line
        })
        .hGetAll(key)
        .exec();
    
        console.log('cache miss for key [%s], set in cache -> [%d]=[%s]', key, setKeyReply, JSON.stringify(fetchedValue, null, 5));
    }
    

    await client.disconnect();

    return event;  // Echo back the sent event
};

const keyNotPresentInCache = async function(key, client) {
    const value = await client.hGetAll(key);
    const keyNotPresent = Object.keys(value).length === 0;
    console.log('checked cache for key [%s], key not present? = [%s]', key, keyNotPresent);
    return keyNotPresent;
}