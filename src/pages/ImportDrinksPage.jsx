import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Upload, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { parseCSV, checkForDuplicates } from '../lib/csvParser'
import { createDrink } from '../lib/api/drinks'
import { useDrinks, drinkKeys } from '../hooks/useDrinks'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Loading from '../components/ui/Loading'

export default function ImportDrinksPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: existingDrinks = [] } = useDrinks()

  const [csvFile, setCsvFile] = useState(null)
  const [parsedDrinks, setParsedDrinks] = useState([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 })
  const [importResults, setImportResults] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    setImportResults(null)

    try {
      const drinks = await parseCSV(file)
      const drinksWithDuplicates = await checkForDuplicates(drinks, existingDrinks)
      setParsedDrinks(drinksWithDuplicates)
    } catch (error) {
      alert('Kunde inte läsa CSV-fil: ' + error.message)
      setCsvFile(null)
    }
  }

  const handleImport = async () => {
    // Filter out drinks with errors and duplicates
    const validDrinks = parsedDrinks.filter(
      d => d._validation.valid && !d._isDuplicate
    )

    if (validDrinks.length === 0) {
      alert('Inga giltiga drinkar att importera')
      return
    }

    if (!confirm(`Vill du importera ${validDrinks.length} drinkar?`)) {
      return
    }

    setImporting(true)
    setImportProgress({ current: 0, total: validDrinks.length })

    const results = {
      success: 0,
      failed: 0,
      skipped: parsedDrinks.filter(d => d._isDuplicate).length,
      errors: [],
    }

    for (let i = 0; i < validDrinks.length; i++) {
      const drink = validDrinks[i]
      setImportProgress({ current: i + 1, total: validDrinks.length })

      try {
        // Remove metadata fields before creating
        const { _rowIndex, _validation, _isDuplicate, ...drinkData } = drink
        await createDrink(drinkData)
        results.success++

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        results.failed++
        results.errors.push({
          drink: drink.name,
          error: error.message,
        })
      }
    }

    setImportResults(results)
    setImporting(false)

    // Invalidate drinks cache to refresh the list
    await queryClient.invalidateQueries({ queryKey: drinkKeys.lists() })
  }

  const getStatusIcon = (drink) => {
    if (drink._isDuplicate) {
      return <RefreshCw className="w-5 h-5 text-blue-500" />
    }
    if (!drink._validation.valid) {
      return <XCircle className="w-5 h-5 text-red-500" />
    }
    if (drink._validation.warnings.length > 0) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />
  }

  const getStatusText = (drink) => {
    if (drink._isDuplicate) {
      return 'Finns redan'
    }
    if (!drink._validation.valid) {
      return drink._validation.errors.join(', ')
    }
    if (drink._validation.warnings.length > 0) {
      return drink._validation.warnings.join(', ')
    }
    return 'Klar att importera'
  }

  const getStatusColor = (drink) => {
    if (drink._isDuplicate) return 'text-blue-600 bg-blue-50'
    if (!drink._validation.valid) return 'text-red-600 bg-red-50'
    if (drink._validation.warnings.length > 0) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const validCount = parsedDrinks.filter(d => d._validation.valid && !d._isDuplicate).length
  const duplicateCount = parsedDrinks.filter(d => d._isDuplicate).length
  const errorCount = parsedDrinks.filter(d => !d._validation.valid).length

  if (importing) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <Loading message={`Importerar ${importProgress.current} av ${importProgress.total}...`} />
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Math.round((importProgress.current / importProgress.total) * 100)}%
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (importResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link to="/drinks" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka till drinkar
        </Link>

        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Import slutförd!</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-gray-700">Importerade:</span>
              <span className="text-2xl font-bold text-green-600">{importResults.success}</span>
            </div>

            {importResults.skipped > 0 && (
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Hoppade över (dubbletter):</span>
                <span className="text-2xl font-bold text-blue-600">{importResults.skipped}</span>
              </div>
            )}

            {importResults.failed > 0 && (
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-700">Misslyckades:</span>
                <span className="text-2xl font-bold text-red-600">{importResults.failed}</span>
              </div>
            )}

            {importResults.errors.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Fel:</h3>
                <div className="space-y-2">
                  {importResults.errors.map((error, idx) => (
                    <div key={idx} className="text-sm text-red-600 bg-red-50 p-3 rounded">
                      <strong>{error.drink}:</strong> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={() => navigate('/drinks')} className="flex-1">
              Visa drinkar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setImportResults(null)
                setCsvFile(null)
                setParsedDrinks([])
              }}
              className="flex-1"
            >
              Importera fler
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/drinks" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Tillbaka
      </Link>

      <h1 className="text-3xl font-bold text-gray-900">Importera drinkar från CSV</h1>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Välj CSV-fil
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="text-sm text-gray-600 mt-2">
              CSV-filen ska vara semikolon-separerad med kolumner för Name, Spritbas, GlassType, ServingType, etc.
            </p>
          </div>

          {!csvFile && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Välj en CSV-fil för att börja</p>
            </div>
          )}
        </div>
      </Card>

      {parsedDrinks.length > 0 && (
        <>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Förhandsgranskning</h2>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">✓ {validCount} klara</span>
                <span className="text-blue-600">🔄 {duplicateCount} dubbletter</span>
                <span className="text-red-600">✗ {errorCount} fel</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Namn</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Spritbas</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Ingredienser</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Kommentar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parsedDrinks.map((drink, idx) => (
                    <tr key={idx} className={getStatusColor(drink)}>
                      <td className="px-4 py-3">
                        {getStatusIcon(drink)}
                      </td>
                      <td className="px-4 py-3 font-medium">{drink.name}</td>
                      <td className="px-4 py-3">{drink.spritbas}</td>
                      <td className="px-4 py-3">{drink.ingredients.length}</td>
                      <td className="px-4 py-3 text-xs">{getStatusText(drink)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              onClick={handleImport}
              disabled={validCount === 0}
              className="flex-1"
            >
              Importera {validCount} drinkar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCsvFile(null)
                setParsedDrinks([])
              }}
              className="flex-1"
            >
              Avbryt
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
