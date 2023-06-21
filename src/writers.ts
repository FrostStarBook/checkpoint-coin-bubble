import { toAddress, hexToDec } from './utils';
import type { CheckpointWriter } from '@snapshot-labs/checkpoint';

export async function handleDeploy() {
  // Run logic as at the time Contract was deployed.
}

// This decodes the new_post events data and stores successfully
// decoded information in the `posts` table.
//
// See here for the original logic used to create post transactions:
// https://gist.github.com/perfectmak/417a4dab69243c517654195edf100ef9#file-index-ts
export async function handleNewPost({ block, tx, event, mysql }: Parameters<CheckpointWriter>[0]) {
  if (!event) return;
  console.log(event.data);
  console.log(tx.transaction_hash);

  const address = toAddress(event.data[0]);
  console.log(address);

  const player_score = BigInt(event.data[1]);
  console.log(player_score);
  const timestamp = block.timestamp;
  const blockNumber = block.block_number;

  const score = {
    id: `${address}/${tx.transaction_hash}`,
    address: address,
    score: player_score,
    tx_hash: tx.transaction_hash,
    created_at: timestamp,
    created_at_block: blockNumber
  };

  // table names are `lowercase(TypeName)s` and can be interacted with sql
  await mysql.queryAsync('INSERT IGNORE INTO scores SET ?', [score]);
}
