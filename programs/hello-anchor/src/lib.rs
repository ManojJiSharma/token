use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("3R9NYa7u97G2tsFFxu73LaaxgQqmKEvpoiPtzwvPpEUC");

#[program]
mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;

        msg!("Changed data to: {}!", data); // Message will show up in the tx logs
        Ok(())
    }

    pub fn counter(ctx: Context<Counter>) -> Result<()> {
        ctx.accounts.counter.data += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // We must specify the space in order to initialize an account.
    // First 8 bytes are default account discriminator,
    // next 8 bytes come from NewAccount.data being type u64.
    // (u64 = 64 bits unsigned integer = 8 bytes)
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewCounter>,
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_value_account: Account<'info, Values>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Counter<'info> {
    #[account(mut)]
    pub counter: Account<'info, NewCounter>,
}

// #[derive]

#[account]
pub struct NewCounter {
    data: u64,
}

#[account]
pub struct Values {
    data1: String,
    data2: u64,
    data3: u128,
}
