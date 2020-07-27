/**
 * Copyright 2018 The Nakama Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as nakamajs from "../src/client";
import {createPage, generateid} from "./utils";
import {Page} from "puppeteer"

describe('Friend Tests', () => {
  
  it('should add friend, then list', async () => {
    const page : Page = await createPage();

    const customid1 = generateid();
    const customid2 = generateid();

    const result = await page.evaluate(async (customid1, customid2) => {
      const client1 = new nakamajs.Client();      
      const session1 = await client1.authenticateCustom({ id: customid1 })
      const client2 = new nakamajs.Client();
      const session2 = await client2.authenticateCustom({ id: customid2 });

      await client1.addFriends(session1, [session2.user_id]);
      return await client1.listFriends(session1);
    }, customid1, customid2);

    expect(result).not.toBeNull();
    expect(result.friends.length).toBe(1);
    expect(result.friends[0].state).toBe(1);
  });

  it('should receive friend invite, then list', async () => {
    const page : Page = await createPage();

    const customid1 = generateid();
    const customid2 = generateid();

    const result = await page.evaluate(async (customid1, customid2) => {
      const client1 = new nakamajs.Client();      
      const session1 = await client1.authenticateCustom({ id: customid1 });
      const client2 = new nakamajs.Client();
      const session2 = await client2.authenticateCustom({ id: customid2 });

      await client1.addFriends(session1, [session2.user_id]);
      return await client2.listFriends(session2);
    }, customid1, customid2);

    expect(result).not.toBeNull();
    expect(result.friends.length).toBe(1);
    expect(result.friends[0].state).toBe(2);
  });

  it('should block friend, then list', async () => {
    const page : Page = await createPage();

    const customid1 = generateid();
    const customid2 = generateid();

    const result = await page.evaluate(async (customid1, customid2) => {
      const client1 = new nakamajs.Client();      
      const session1 = await client1.authenticateCustom({ id: customid1 });
      const client2 = new nakamajs.Client();
      const session2 = await client2.authenticateCustom({ id: customid2 });

      await client1.blockFriends(session1, [session2.user_id]);
      return await client1.listFriends(session1);
    }, customid1, customid2);

    expect(result).not.toBeNull();
    expect(result.friends.length).toBe(1);
    expect(result.friends[0].state).toBe(3);
  });

  it('should add friend, accept, then list', async () => {
    const page : Page = await createPage();

    const customid1 = generateid();
    const customid2 = generateid();

    const result = await page.evaluate(async (customid1, customid2) => {
      const client1 = new nakamajs.Client();      
      const session1 = await client1.authenticateCustom({ id: customid1 });
      const client2 = new nakamajs.Client();
      const session2 = await client2.authenticateCustom({ id: customid2 });

      await client1.addFriends(session1, [session2.user_id]);
      await client2.addFriends(session2, [session1.user_id]);
      return await client1.listFriends(session1);
    }, customid1, customid2);

    expect(result).not.toBeNull();
    expect(result.friends.length).toBe(1);
    expect(result.friends[0].state).toBe(0);
  });

  it('should add friend, reject, then list', async () => {
    const page : Page = await createPage();

    const customid1 = generateid();
    const customid2 = generateid();

    const result = await page.evaluate(async (customid1, customid2) => {
      const client1 = new nakamajs.Client();      
      const session1 = await client1.authenticateCustom({ id: customid1 });
      const client2 = new nakamajs.Client();
      const session2 = await client2.authenticateCustom({ id: customid2 });

      await client1.addFriends(session1, [session2.user_id]);
      await client2.deleteFriends(session2, [session1.user_id]);
      return await client1.listFriends(session1);
    }, customid1, customid2);

    expect(result).not.toBeNull();
    expect(result.friends.length).toBe(0);
  });

});