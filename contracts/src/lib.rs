#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, token};

#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    TotalPrizePool,
}

#[contract]
pub struct TournamentRewards;

#[contractimpl]
impl TournamentRewards {
    /// Initialize the tournament contract with an admin and the token to be used for rewards (e.g., XLM/USDC)
    pub fn init(env: Env, admin: Address, token: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::TotalPrizePool, &0i128);
    }

    /// Admin deposits tokens into the prize pool
    pub fn deposit_prize(env: Env, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Transfer from admin to the contract
        token_client.transfer(&admin, &env.current_contract_address(), &amount);

        let current_pool: i128 = env.storage().instance().get(&DataKey::TotalPrizePool).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalPrizePool, &(current_pool + amount));
    }

    /// Distribute rewards to a winning player (called by the server after match verification)
    pub fn payout_winner(env: Env, winner: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth(); // Only the verified game server/admin can authorize a payout

        let current_pool: i128 = env.storage().instance().get(&DataKey::TotalPrizePool).unwrap_or(0);
        if amount > current_pool {
            panic!("Insufficient funds in the prize pool");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Transfer from contract to the winner
        token_client.transfer(&env.current_contract_address(), &winner, &amount);

        env.storage().instance().set(&DataKey::TotalPrizePool, &(current_pool - amount));
    }

    /// View current prize pool balance
    pub fn get_prize_pool(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalPrizePool).unwrap_or(0)
    }
}
