import React from 'react'
import { render, screen } from '@testing-library/react'

// Simple helper component used only for this test
function DevisTVA({ montantHT = 100, tva = 20 }) {
  const montantTVA = +(montantHT * (tva / 100)).toFixed(2)
  const montantTTC = +(montantHT + montantTVA).toFixed(2)
  return (
    <div>
      <div data-testid="montant-ht">{montantHT}</div>
      <div data-testid="tva">{montantTVA}</div>
      <div data-testid="montant-ttc">{montantTTC}</div>
    </div>
  )
}

describe('DevisTVA component', () => {
  it('calculates TVA and TTC correctly for default values', () => {
    render(<DevisTVA />)

    expect(screen.getByTestId('montant-ht')).toHaveTextContent('100')
    expect(screen.getByTestId('tva')).toHaveTextContent('20')
    expect(screen.getByTestId('montant-ttc')).toHaveTextContent('120')
  })

  it('applies custom TVA rate and amount', () => {
    render(<DevisTVA montantHT={250} tva={5} />)

    expect(screen.getByTestId('montant-ht')).toHaveTextContent('250')
    expect(screen.getByTestId('tva')).toHaveTextContent('12.5')
    expect(screen.getByTestId('montant-ttc')).toHaveTextContent('262.5')
  })
})
